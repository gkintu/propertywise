// Quick test script to verify Redis connection
import { Redis } from "@upstash/redis";
import { config } from 'dotenv';

// Load environment variables from .env.local
config({ path: '.env.local' });

async function testRedis() {
  try {
    console.log("Testing Redis connection...");
    console.log("URL exists:", !!process.env.UPSTASH_REDIS_REST_URL);
    console.log("Token exists:", !!process.env.UPSTASH_REDIS_REST_TOKEN);
    
    if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
      console.log("❌ Environment variables not found");
      return;
    }
    
    const redis = Redis.fromEnv();
    
    // Simple ping test
    const result = await redis.ping();
    console.log("✅ Redis ping successful:", result);
    
    // Test set/get
    await redis.set("test-key", "test-value");
    const value = await redis.get("test-key");
    console.log("✅ Redis set/get test:", value);
    
    // Clean up
    await redis.del("test-key");
    console.log("✅ Redis connection working correctly");
    
  } catch (error) {
    console.error("❌ Redis connection failed:", error.message);
    console.error("Full error:", error);
  }
}

testRedis();
