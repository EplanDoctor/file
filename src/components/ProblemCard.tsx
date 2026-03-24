"use client";

import { Problem } from "@/lib/firebase/services";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { BadgeCheck, Clock, ArrowRight } from "lucide-react";
import { Button } from "./ui/button";

interface ProblemCardProps {
  problem: Problem;
  onClick?: (problem: Problem) => void;
}

export function ProblemCard({ problem, onClick }: ProblemCardProps) {
  return (
    <Card className="flex flex-col h-full hover:-translate-y-1 transition-transform duration-300">
      <CardHeader>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-electric-600 dark:text-electric-400 bg-electric-50 dark:bg-electric-900/30 px-3 py-1 rounded-full">
            {problem.category}
          </span>
          {problem.resolved ? (
            <span className="flex items-center text-xs text-emerald-600 dark:text-emerald-400 font-medium">
              <BadgeCheck className="w-4 h-4 mr-1" />
              Çözüldü
            </span>
          ) : (
            <span className="flex items-center text-xs text-amber-600 dark:text-amber-400 font-medium">
              <Clock className="w-4 h-4 mr-1" />
              Bekliyor
            </span>
          )}
        </div>
        <CardTitle className="text-lg leading-tight line-clamp-2">{problem.title}</CardTitle>
        <CardDescription className="line-clamp-2 mt-2">
          {problem.description}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
      </CardContent>
      <CardFooter>
        <Button 
          variant={problem.resolved ? "secondary" : "default"} 
          className="w-full"
          onClick={() => onClick && onClick(problem)}
        >
          {problem.resolved ? "Çözümü İncele" : "Detayları Gör"}
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </CardFooter>
    </Card>
  );
}
