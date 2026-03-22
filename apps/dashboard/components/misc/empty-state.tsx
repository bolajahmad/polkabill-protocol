import { cn } from '@/lib/utils';
import { ReactNode } from 'react';
import {
    Empty,
    EmptyContent,
    EmptyDescription,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle,
} from '../ui/empty';

type Props = {
  title: ReactNode;
  description: ReactNode;
  icon?: any;
  footer?: ReactNode;
  className?: string;
};
export const EmptyState = ({ title, description, footer, className, icon: Icon }: Props) => {
  return (
    <Empty
      className={cn(
        'flex flex-col items-center justify-center p-12 text-center space-y-4 bg-neutral-50/30 rounded-3xl border border-dashed border-neutral-200',
        className,
      )}
    >
      <EmptyHeader>
        {Icon && (
          <EmptyMedia
            variant="icon"
            className="w-16 h-16 bg-white rounded-2xl shadow-sm border border-neutral-100 flex items-center justify-center text-neutral-400 mb-2"
          >
            <Icon size={32} />
          </EmptyMedia>
        )}
      </EmptyHeader>

      <EmptyContent className="max-w-xs space-y-1">
        <EmptyTitle className="text-lg font-bold tracking-tight">{title}</EmptyTitle>
        <EmptyDescription className="text-sm text-neutral-500 leading-relaxed">
          {description}
        </EmptyDescription>

        {footer}
      </EmptyContent>
    </Empty>
  );
};
