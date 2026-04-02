import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { PlayCircle } from "lucide-react";

interface VideoCardProps {
  title: string;
  duration: string;
  thumbnailUrl?: string; // or an image prompt reference
  onClick?: () => void;
}

export function VideoCard({ title, duration, onClick }: VideoCardProps) {
  return (
    <Card 
      onClick={onClick}
      className="overflow-hidden group cursor-pointer transition-all duration-300 hover:scale-[1.03] hover:shadow-2xl hover:shadow-blue-500/20 border-slate-200 dark:border-slate-800 rounded-[40px]"
    >
      <div className="relative aspect-video bg-slate-100 dark:bg-slate-800 flex items-center justify-center overflow-hidden">
        {/* Mock Placeholder for Thumbnail */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
        <PlayCircle className="w-16 h-16 text-white/50 group-hover:scale-110 group-hover:text-white transition-all z-20 group-hover:drop-shadow-[0_0_15px_rgba(59,130,246,0.8)]" />
        <span className="absolute bottom-4 right-4 text-[10px] font-black text-white bg-black/70 px-3 py-1.5 rounded-full z-20 uppercase tracking-widest border border-white/20">
          {duration}
        </span>
      </div>
      <CardHeader className="p-6">
        <CardTitle className="text-sm font-black leading-tight group-hover:text-blue-600 transition-colors uppercase tracking-widest h-10 line-clamp-2">
          {title}
        </CardTitle>
      </CardHeader>
    </Card>
  );
}
