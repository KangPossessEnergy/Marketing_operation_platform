import React from "react";
import { Breadcrumb } from "antd";
import type { BreadcrumbProps } from "antd";
import "./index.less";

export interface PageBreadcrumbProps
  extends Omit<BreadcrumbProps, "items"> {
  items: BreadcrumbProps["items"];
}

const PageBreadcrumb: React.FC<PageBreadcrumbProps> = ({
  className,
  ...props
}) => (
  <Breadcrumb
    {...props}
    className={["page-breadcrumb", className].filter(Boolean).join(" ")}
  />
);

export default PageBreadcrumb;
