"use client";

import React from "react";
import { Card, CardBody, CardHeader, CardFooter } from "@heroui/react";
import { Divider } from "@heroui/react";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 px-4 py-4">
      <div className="max-w-7xl mx-auto space-y-6">{children}</div>
    </div>
  );
}

interface DashboardCardProps {
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
  headerAction?: React.ReactNode;
  footer?: React.ReactNode;
}

export function DashboardCard({
  title,
  subtitle,
  children,
  className = "",
  headerAction,
  footer,
}: DashboardCardProps) {
  return (
    <Card className={`bg-white shadow-sm ${className}`}>
      {(title || subtitle || headerAction) && (
        <>
          <CardHeader className="flex flex-col items-start pb-0 pt-4 px-4">
            <div className="flex w-full justify-between items-center">
              <div>
                {title && <h3 className="text-lg font-semibold">{title}</h3>}
                {subtitle && (
                  <p className="text-sm text-gray-500">{subtitle}</p>
                )}
              </div>
              {headerAction && <div>{headerAction}</div>}
            </div>
          </CardHeader>
          <Divider />
        </>
      )}
      <CardBody className="p-4">{children}</CardBody>
      {footer && (
        <>
          <Divider />
          <CardFooter className="px-4 py-3">{footer}</CardFooter>
        </>
      )}
    </Card>
  );
}

interface KPICardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  icon?: React.ReactNode;
  color?:
    | "primary"
    | "secondary"
    | "success"
    | "warning"
    | "danger"
    | "default";
}

export function KPICard({
  title,
  value,
  subtitle,
  trend,
  icon,
  color = "default",
}: KPICardProps) {
  return (
    <Card className="bg-white shadow-sm">
      <CardBody className="p-4">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <p className="text-sm font-medium text-gray-500">{title}</p>
            <p className="text-2xl font-bold">{value}</p>
            {subtitle && <p className="text-xs text-gray-400">{subtitle}</p>}
            {trend && (
              <div
                className={`text-xs font-medium ${
                  trend.isPositive ? "text-success" : "text-danger"
                }`}
              >
                {trend.isPositive ? "↑" : "↓"} {Math.abs(trend.value)}%
              </div>
            )}
          </div>
          {icon && (
            <div className={`p-2 rounded-lg bg-${color}-100 text-${color}-600`}>
              {icon}
            </div>
          )}
        </div>
      </CardBody>
    </Card>
  );
}

interface StatGridProps {
  children: React.ReactNode;
  columns?: 2 | 3 | 4 | 5;
}

export function StatGrid({ children, columns = 4 }: StatGridProps) {
  const gridCols = {
    2: "grid-cols-1 md:grid-cols-2",
    3: "grid-cols-1 md:grid-cols-3",
    4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-4",
    5: "grid-cols-1 md:grid-cols-3 lg:grid-cols-5",
  };

  return <div className={`grid gap-4 ${gridCols[columns]}`}>{children}</div>;
}

interface DataTableProps<T> {
  data: T[];
  columns: {
    key: keyof T | string;
    label: string;
    render?: (item: T) => React.ReactNode;
  }[];
  emptyMessage?: string;
  isLoading?: boolean;
}

export function DataTable<T extends Record<string, unknown>>({
  data,
  columns,
  emptyMessage = "No data available",
  isLoading = false,
}: DataTableProps<T>) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center py-8 text-gray-500">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-200">
            {columns.map((col) => (
              <th
                key={String(col.key)}
                className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider py-3 px-4"
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {data.map((item, index) => (
            <tr key={index} className="hover:bg-gray-50">
              {columns.map((col) => (
                <td key={String(col.key)} className="py-3 px-4">
                  {col.render
                    ? col.render(item)
                    : String(item[col.key as keyof T] ?? "")}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

interface ProgressBarProps {
  value: number;
  max?: number;
  label?: string;
  showPercentage?: boolean;
  color?: string;
  size?: "sm" | "md" | "lg";
}

export function ProgressBar({
  value,
  max = 100,
  label,
  showPercentage = true,
  color = "bg-primary-500",
  size = "md",
}: ProgressBarProps) {
  const percentage = Math.min((value / max) * 100, 100);
  const height = {
    sm: "h-1",
    md: "h-2",
    lg: "h-3",
  };

  return (
    <div className="space-y-1">
      {(label || showPercentage) && (
        <div className="flex justify-between text-xs">
          {label && <span className="text-gray-600">{label}</span>}
          {showPercentage && (
            <span className="text-gray-500">{Math.round(percentage)}%</span>
          )}
        </div>
      )}
      <div className={`w-full bg-gray-200 rounded-full ${height[size]}`}>
        <div
          className={`${color} ${height[size]} rounded-full transition-all duration-300`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

interface BadgeProps {
  children: React.ReactNode;
  color?:
    | "default"
    | "primary"
    | "secondary"
    | "success"
    | "warning"
    | "danger";
  variant?: "flat" | "solid" | "dot";
  size?: "sm" | "md" | "lg";
}

export function Badge({
  children,
  color = "default",
  variant = "flat",
  size = "md",
}: BadgeProps) {
  const colorMap = {
    default: "bg-gray-100 text-gray-600",
    primary: "bg-primary-100 text-primary-600",
    secondary: "bg-secondary-100 text-secondary-600",
    success: "bg-success-100 text-success-600",
    warning: "bg-warning-100 text-warning-600",
    danger: "bg-danger-100 text-danger-600",
  };

  const sizeMap = {
    sm: "text-xs px-2 py-0.5",
    md: "text-sm px-2.5 py-1",
    lg: "text-base px-3 py-1.5",
  };

  return (
    <span
      className={`inline-flex items-center rounded-full font-medium ${colorMap[color]} ${sizeMap[size]}`}
    >
      {children}
    </span>
  );
}

interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
}

export function EmptyState({
  title,
  description,
  icon,
  action,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      {icon && <div className="mb-4 text-gray-400">{icon}</div>}
      <h3 className="text-lg font-medium text-gray-900">{title}</h3>
      {description && (
        <p className="mt-1 text-sm text-gray-500">{description}</p>
      )}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

interface LoadingStateProps {
  message?: string;
}

export function LoadingState({ message = "Loading..." }: LoadingStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-2" />
      <p className="text-sm text-gray-500">{message}</p>
    </div>
  );
}
