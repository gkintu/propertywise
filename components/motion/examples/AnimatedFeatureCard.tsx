"use client";

import { motion } from "motion/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, FileText, Download } from "lucide-react";

// Example component showing advanced Framer Motion usage
export default function AnimatedFeatureCard() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: [0.25, 0.25, 0.75, 0.75] as const
      }
    }
  };

  const buttonVariants = {
    hover: {
      scale: 1.05,
      transition: {
        duration: 0.2,
        ease: [0.25, 0.25, 0.75, 0.75] as const
      }
    },
    tap: {
      scale: 0.95
    }
  };

  const iconVariants = {
    hover: {
      rotate: 360,
      transition: {
        duration: 0.6,
        ease: [0.25, 0.25, 0.75, 0.75] as const
      }
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6"
    >
      {/* Upload Feature */}
      <motion.div variants={itemVariants}>
        <Card className="h-full dark:bg-[#1F2937] dark:border-[#374151] overflow-hidden">
          <CardHeader className="text-center">
            <motion.div
              variants={iconVariants}
              whileHover="hover"
              className="w-16 h-16 mx-auto bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center mb-4"
            >
              <Upload className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            </motion.div>
            <CardTitle className="dark:text-[#F9FAFB]">Upload PDF</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 dark:text-[#D1D5DB] text-center mb-4">
              Securely upload your property documents for AI analysis
            </p>
            <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
              <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                Choose File
              </Button>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Analysis Feature */}
      <motion.div variants={itemVariants}>
        <Card className="h-full dark:bg-[#1F2937] dark:border-[#374151] overflow-hidden">
          <CardHeader className="text-center">
            <motion.div
              variants={iconVariants}
              whileHover="hover"
              className="w-16 h-16 mx-auto bg-yellow-100 dark:bg-yellow-900/20 rounded-full flex items-center justify-center mb-4"
            >
              <FileText className="w-8 h-8 text-yellow-600 dark:text-yellow-400" />
            </motion.div>
            <CardTitle className="dark:text-[#F9FAFB]">AI Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 dark:text-[#D1D5DB] text-center mb-4">
              Get comprehensive property insights powered by Google Gemini AI
            </p>
            <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
              <Button className="w-full bg-yellow-500 hover:bg-yellow-600 text-white dark:text-[#111827]">
                Analyze Now
              </Button>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Download Feature */}
      <motion.div variants={itemVariants}>
        <Card className="h-full dark:bg-[#1F2937] dark:border-[#374151] overflow-hidden">
          <CardHeader className="text-center">
            <motion.div
              variants={iconVariants}
              whileHover="hover"
              className="w-16 h-16 mx-auto bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mb-4"
            >
              <Download className="w-8 h-8 text-green-600 dark:text-green-400" />
            </motion.div>
            <CardTitle className="dark:text-[#F9FAFB]">Download Report</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 dark:text-[#D1D5DB] text-center mb-4">
              Export your analysis results as a professional PDF report
            </p>
            <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
              <Button className="w-full bg-green-600 hover:bg-green-700 text-white">
                Get Report
              </Button>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
