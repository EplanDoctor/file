import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { PlayCircle } from "lucide-react";

interface VideoCardProps {
  title: string;
  duration: string;
  thumbnailUrl?: string; // or an image prompt reference
}

export function VideoCard({ title, duration }: VideoCardProps) {
  return (
    <Card className="overflow-hidden group cursor-pointer">
      <div className="relative aspect-video bg-slate-100 dark:bg-slate-800 flex items-center justify-center overflow-hidden">
        {/* Mock Placeholder for Thumbnail */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
        <PlayCircle className="w-16 h-16 text-white/80 group-hover:scale-110 group-hover:text-white transition-all z-20" />
        <span className="absolute bottom-3 right-3 text-xs font-medium text-white bg-black/70 px-2 py-1 rounded-md z-20">
          {duration}
        </span>
      </div>
      <CardHeader className="p-4">
        <CardTitle className="text-base leading-tight group-hover:text-electric-600 transition-colors">
          {title}
        </CardTitle>
      </CardHeader>
    </Card>
  );
}
