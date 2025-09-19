import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface CustomCardProps {
  title: string;
  icon?: LucideIcon;
  iconColor?: string;
  children: React.ReactNode;
  className?: string;
  headerClassName?: string;
  contentClassName?: string;
  showIcon?: boolean;
  iconSize?: "sm" | "md" | "lg";
}

const iconSizes = {
  sm: "w-4 h-4",
  md: "w-5 h-5",
  lg: "w-6 h-6",
};

export function CustomCard({
  title,
  icon: Icon,
  iconColor = "text-gray-600",
  children,
  className = "",
  headerClassName = "",
  contentClassName = "",
  showIcon = true,
  iconSize = "md",
}: CustomCardProps) {
  return (
    <Card className={`border border-gray-200 shadow-sm ${className}`}>
      <CardHeader className={`pb-4 ${headerClassName}`}>
        <CardTitle
          className={`flex items-center gap-2 text-lg font-medium text-gray-900 ${contentClassName}`}
        >
          {showIcon && Icon && (
            <Icon className={`${iconSizes[iconSize]} ${iconColor}`} />
          )}
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className={contentClassName}>{children}</CardContent>
    </Card>
  );
}

// Specialized card variants for common use cases
interface InfoCardProps {
  title: string;
  icon: LucideIcon;
  iconColor?: string;
  content: string;
  className?: string;
}

export function InfoCard({
  title,
  icon: Icon,
  iconColor = "text-blue-600",
  content,
  className = "",
}: InfoCardProps) {
  return (
    <CustomCard
      title={title}
      icon={Icon}
      iconColor={iconColor}
      className={className}
    >
      <p className="text-sm text-gray-600 leading-relaxed">{content}</p>
    </CustomCard>
  );
}

interface EditableCardProps {
  title: string;
  icon?: LucideIcon;
  iconColor?: string;
  children: React.ReactNode;
  className?: string;
  subtitle?: string;
}

export function EditableCard({
  title,
  icon: Icon,
  iconColor = "text-gray-600",
  children,
  className = "",
  subtitle,
}: EditableCardProps) {
  return (
    <CustomCard
      title={title}
      icon={Icon}
      iconColor={iconColor}
      className={className}
    >
      {subtitle && <p className="text-sm text-gray-500 mb-4">{subtitle}</p>}
      {children}
    </CustomCard>
  );
}
