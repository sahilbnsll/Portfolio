import { redirect } from "next/navigation";

export const metadata = {
  title: "Cloud Architecture & Systems Design",
  description:
    "Interactive cloud architecture topologies, multi-tenant Kubernetes topologies, and automated GitOps CI/CD delivery pipelines.",
};

export default function ArchitecturePage() {
  redirect("/#architecture");
}
