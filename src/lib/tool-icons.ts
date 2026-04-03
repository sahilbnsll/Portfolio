import { LocaleRouteNormalizer } from "next/dist/server/future/normalizers/locale-route-normalizer";

export type ToolIconDef = {
  name: string;
  url: string;
};

const LOCAL = "/icons/tools";

export const TOOL_ICONS: Record<string, ToolIconDef> = {
  AWS: {
    name: "AWS",
    url: `${LOCAL}/Aws.svg`,
  },
  Kubernetes: {
    name: "Kubernetes",
    url: `${LOCAL}/Kubernetes.svg`,
  },
  Docker: {
    name: "Docker",
    url: `${LOCAL}/Docker.svg`,
  },
  Terraform: {
    name: "Terraform",
    url: `${LOCAL}/Terraform.svg`,
  },
  Prometheus: {
    name: "Prometheus",
    url: `${LOCAL}/Prometheus.svg`,
  },
  Grafana: {
    name: "Grafana",
    url: `${LOCAL}/Grafana.svg`,
  },
  Supabase: {
    name: "Supabase",
    url: `${LOCAL}/Supabase.svg`,
  },
  PostgreSQL: {
    name: "PostgreSQL",
    url: `${LOCAL}/Postgresql.svg`,
  },
  MySQL: {
    name: "MySQL",
    url: `${LOCAL}/Mysql.svg`,
  },
  MongoDB: {
    name: "MongoDB",
    url: `${LOCAL}/Mongo.svg`,
  },
  Python: {
    name: "Python",
    url: `${LOCAL}/Python.svg`,
  },
  Bash: {
    name: "Bash",
    url: `${LOCAL}/BashIcon.svg`,
  },
  Jenkins: {
    name: "Jenkins",
    url: `${LOCAL}/Jenkins.svg`,
  },
  Auth0: {
    name: "Auth0",
    url: `${LOCAL}/Auth0.svg`,
  },
  ClickHouse: {
    name: "ClickHouse",
    url: `${LOCAL}/Clickhouse.svg`,
  },
  Git: {
    name: "Git",
    url: `${LOCAL}/Git.svg`,
  },
  "GitHub Actions": {
    name: "GitHub Actions",
    url: `${LOCAL}/GithubActions.svg`,
  },
  "AWS CloudFormation": {
    name: "AWS CloudFormation",
    url: `${LOCAL}/Cloudformation.svg`,
  },
  "AWS CodeBuild": {
    name: "AWS CodeBuild",
    url: `${LOCAL}/Codebuild.svg`,
  },
  "AWS CloudWatch": {
    name: "AWS CloudWatch",
    url: `${LOCAL}/Cloudwatch.svg`,
  },
  IAM: {
    name: "IAM",
    url: `${LOCAL}/iam.svg`,
  },
  HCL: {
    name: "HashiCorp",
    url: `${LOCAL}/Hashicorp.svg`,
  },
  YAML: {
    name: "YAML",
    url: `${LOCAL}/Yaml.svg`,
  },
  n8n: {
    name: "n8n",
    url: `${LOCAL}/n8n.svg`,
  },
  DLT: {
    name: "DLT",
    url: `${LOCAL}/DLT.svg`,
  },
  DBT: {
    name: "dbt",
    url: `${LOCAL}/DBT.svg`,
  },
  Dagster: {
    name: "Dagster",
    url: `${LOCAL}/dagster.svg`,
  },
  "LinkedIn API": {
    name: "LinkedIn",
    url: `${LOCAL}/Linkedin.svg`,
  },
  "Discord Bots": {
    name: "Discord",
    url: `${LOCAL}/Discord.svg`,
  },
  DevSecOps: {
    name: "Snyk",
    url: `${LOCAL}/DevSecOps.svg`,
  },
};

export function getToolIcon(name: string): ToolIconDef | null {
  return TOOL_ICONS[name] ?? null;
}
