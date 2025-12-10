import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export const AIAssistantSkeleton = () => (
  <Card className="mb-12 overflow-hidden border-0 shadow-lg bg-gradient-to-br from-card to-muted/30">
    <CardHeader className="pb-4">
      <div className="flex items-center gap-3">
        <Skeleton className="h-10 w-10 rounded-xl" />
        <div className="space-y-2">
          <Skeleton className="h-5 w-24" />
          <Skeleton className="h-4 w-48" />
        </div>
      </div>
    </CardHeader>
    <CardContent className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-8 w-24 rounded-full" />
        ))}
      </div>
      <Skeleton className="h-12 w-full rounded-xl" />
    </CardContent>
  </Card>
);

export const MetricsSkeleton = () => (
  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-12">
    {[1, 2, 3, 4].map((i) => (
      <Card key={i} className="h-full border-0 shadow-sm">
        <CardContent className="pt-6 pb-5 px-5">
          <div className="flex items-center justify-between mb-4">
            <Skeleton className="h-5 w-5 rounded" />
            <Skeleton className="h-5 w-10 rounded-full" />
          </div>
          <Skeleton className="h-9 w-20 mb-2" />
          <Skeleton className="h-4 w-28 mb-3" />
          <Skeleton className="h-1.5 w-full rounded-full" />
        </CardContent>
      </Card>
    ))}
  </div>
);

export const QuickActionsSkeleton = () => (
  <div className="mb-12">
    <Skeleton className="h-6 w-32 mb-5" />
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
      {[1, 2, 3, 4, 5].map((i) => (
        <Card key={i} className="h-full border-0 shadow-sm">
          <CardContent className="flex items-center gap-4 p-5">
            <Skeleton className="h-10 w-10 rounded-xl" />
            <Skeleton className="h-4 w-20" />
          </CardContent>
        </Card>
      ))}
    </div>
  </div>
);

export const BrandOverviewSkeleton = () => (
  <div>
    <Skeleton className="h-6 w-36 mb-5" />
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
      {[1, 2, 3].map((i) => (
        <Card key={i} className="border-0 shadow-sm">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Skeleton className="h-4 w-4 rounded" />
              <Skeleton className="h-4 w-20" />
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-2">
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-4 w-32" />
            </div>
            <Skeleton className="h-px w-full" />
            <div className="space-y-2">
              <Skeleton className="h-3 w-12" />
              <Skeleton className="h-4 w-40" />
            </div>
            <Skeleton className="h-px w-full" />
            <div className="flex gap-1.5">
              <Skeleton className="h-6 w-16 rounded-full" />
              <Skeleton className="h-6 w-20 rounded-full" />
              <Skeleton className="h-6 w-14 rounded-full" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  </div>
);

export const DashboardSkeleton = () => (
  <>
    <AIAssistantSkeleton />
    <MetricsSkeleton />
    <QuickActionsSkeleton />
    <BrandOverviewSkeleton />
  </>
);
