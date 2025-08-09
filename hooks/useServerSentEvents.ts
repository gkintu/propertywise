import { useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';

export interface ProgressEvent {
  type: 'progress' | 'stage' | 'complete' | 'error';
  progress: number;
  stage: string;
  message?: string;
  data?: any;
}

export interface SSEConfig {
  url: string;
  options?: {
    retryDelay?: number;
    maxRetries?: number;
    timeout?: number;
  };
}

export interface SSEState {
  isConnected: boolean;
  isConnecting: boolean;
  error: string | null;
  lastEvent: ProgressEvent | null;
  retryCount: number;
}

export function useServerSentEvents(config: SSEConfig | null) {
  const t = useTranslations('HomePage');
  const [state, setState] = useState<SSEState>({
    isConnected: false,
    isConnecting: false,
    error: null,
    lastEvent: null,
    retryCount: 0,
  });

  const eventSourceRef = useRef<EventSource | null>(null);
  const retryTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const connectionTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const configRef = useRef<SSEConfig | null>(config);

  // Update config ref when it changes
  useEffect(() => {
    configRef.current = config;
  }, [config]);

  const cleanup = () => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }
    if (retryTimeoutRef.current) {
      clearTimeout(retryTimeoutRef.current);
      retryTimeoutRef.current = null;
    }
    if (connectionTimeoutRef.current) {
      clearTimeout(connectionTimeoutRef.current);
      connectionTimeoutRef.current = null;
    }
  };

  const connect = () => {
    const currentConfig = configRef.current;
    if (!currentConfig) return;

    cleanup();

    setState(prev => ({
      ...prev,
      isConnecting: true,
      error: null,
    }));

    try {
      const eventSource = new EventSource(currentConfig.url);
      eventSourceRef.current = eventSource;

      // Connection timeout
      const timeout = currentConfig.options?.timeout || 30000; // 30 seconds
      connectionTimeoutRef.current = setTimeout(() => {
        if (eventSource.readyState === EventSource.CONNECTING) {
          console.warn('SSE connection timeout');
          eventSource.close();
          setState(prev => ({
            ...prev,
            isConnected: false,
            isConnecting: false,
            error: t('upload.errors.connectionTimeout') || 'Connection timeout',
          }));
        }
      }, timeout);

      eventSource.onopen = () => {
        console.log('SSE connection opened');
        if (connectionTimeoutRef.current) {
          clearTimeout(connectionTimeoutRef.current);
          connectionTimeoutRef.current = null;
        }
        setState(prev => ({
          ...prev,
          isConnected: true,
          isConnecting: false,
          error: null,
          retryCount: 0,
        }));
      };

      eventSource.onmessage = (event) => {
        try {
          const progressEvent: ProgressEvent = JSON.parse(event.data);
          console.log('SSE progress event:', progressEvent);
          setState(prev => ({
            ...prev,
            lastEvent: progressEvent,
            error: null,
          }));
        } catch (error) {
          console.error('Error parsing SSE event:', error, event.data);
          setState(prev => ({
            ...prev,
            error: t('upload.errors.invalidEventData') || 'Invalid event data received',
          }));
        }
      };

      eventSource.onerror = (error) => {
        
        setState(prev => {
          const newState = {
            ...prev,
            isConnected: false,
            isConnecting: false,
          };

          // Check if this is a benign cleanup error after successful completion
          if (prev.lastEvent?.type === 'complete' && eventSource.readyState === EventSource.CONNECTING) {
            console.log('Ignoring benign SSE cleanup error after successful completion');
            return prev; // Don't update state
          }

          // Check readyState and provide more detailed error info
          if (eventSource.readyState === EventSource.CLOSED) {
            const maxRetries = currentConfig.options?.maxRetries || 3;
            
            if (prev.retryCount < maxRetries) {
              const retryDelay = (currentConfig.options?.retryDelay || 1000) * Math.pow(2, prev.retryCount);
              console.log(`Retrying SSE connection in ${retryDelay}ms (attempt ${prev.retryCount + 1}/${maxRetries})`);
              
              retryTimeoutRef.current = setTimeout(() => {
                setState(prevState => ({
                  ...prevState,
                  retryCount: prevState.retryCount + 1,
                }));
                connect();
              }, retryDelay);
              
              newState.error = t('upload.errors.connectionRetrying') || `Connection lost, retrying... (${prev.retryCount + 1}/${maxRetries})`;
            } else {
              newState.error = t('upload.errors.connectionFailed') || 'Connection failed after multiple attempts';
            }
          } else if (eventSource.readyState === EventSource.CONNECTING) {
            newState.error = 'Connection still establishing...';
          } else {
            newState.error = `EventSource error (readyState: ${eventSource.readyState})`;
          }

          return newState;
        });
      };

    } catch (error) {
      console.error('Error creating EventSource:', error);
      setState(prev => ({
        ...prev,
        isConnected: false,
        isConnecting: false,
        error: error instanceof Error ? error.message : t('upload.errors.connectionError') || 'Connection error',
      }));
    }
  };

  // Connect when config is provided
  useEffect(() => {
    if (config) {
      connect();
    } else {
      cleanup();
      setState({
        isConnected: false,
        isConnecting: false,
        error: null,
        lastEvent: null,
        retryCount: 0,
      });
    }

    return cleanup;
  }, [config?.url]); // Only reconnect when URL changes

  // Cleanup on unmount
  useEffect(() => {
    return cleanup;
  }, []);

  // Manual control functions
  const disconnect = () => {
    cleanup();
    setState({
      isConnected: false,
      isConnecting: false,
      error: null,
      lastEvent: null,
      retryCount: 0,
    });
  };

  const reconnect = () => {
    if (config) {
      setState(prev => ({ ...prev, retryCount: 0 }));
      connect();
    }
  };

  return {
    ...state,
    disconnect,
    reconnect,
  };
}