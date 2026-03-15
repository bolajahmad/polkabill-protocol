import { cn } from "@/lib/utils";
import { CheckCircle2 } from "lucide-react";
import { ReactNode } from "react";
import { Button } from "../ui/button";
import { Card } from "../ui/card";

type Props = {
    label: ReactNode;
    icon: any;
    value: string;
}

export const StatCard = ({ label, value, icon: Icon }: Props) => (
  <Card className="p-6 space-y-2">
    <div className="flex justify-between items-start">
      <p className="text-xs font-bold text-neutral-400 uppercase tracking-widest">
        {label}
      </p>
      <div className="p-2 bg-neutral-50 rounded-lg text-neutral-400">
        {Icon ? <Icon size={16} /> : null}
      </div>
    </div>
    <p className="text-2xl font-bold tracking-tight">{value}</p>
  </Card>
);

export const FeatureCard = ({ icon: Icon, title, description }: any) => (
  <div className="p-8 space-y-4">
    <div className="w-12 h-12 bg-black rounded-2xl flex items-center justify-center text-white">
      <Icon size={24} />
    </div>
    <h3 className="text-xl font-bold">{title}</h3>
    <p className="text-neutral-500 leading-relaxed">{description}</p>
  </div>
);

export const RoleCard = ({ title, description, onClick, features, disabled }: any) => (
  <Card className={cn(
    "p-8 transition-all group flex flex-col h-full",
    disabled ? "opacity-50 grayscale cursor-not-allowed" : "hover:border-black/20 cursor-pointer"
  )}>
    <h3 className="text-2xl font-bold mb-2">{title}</h3>
    <p className="text-neutral-500 text-sm mb-8 flex-1">{description}</p>
    <ul className="space-y-3 mb-8">
      {features.map((f: string) => (
        <li key={f} className="flex items-center gap-2 text-sm font-medium text-neutral-700">
          <CheckCircle2 size={16} className="text-neutral-400" />
          {f}
        </li>
      ))}
    </ul>
    <Button 
      variant="secondary" 
      onClick={disabled ? undefined : onClick} 
      className={cn(
        "w-full rounded-xl transition-colors",
        !disabled && "group-hover:bg-gray-100 hover:bg-black hover:text-white"
      )}
    >
      Enter Portal
    </Button>
  </Card>
);