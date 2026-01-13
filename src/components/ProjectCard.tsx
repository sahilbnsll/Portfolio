import { Badge } from "@/components/ui/Badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import { Project } from "@/lib/schemas";
import Link from "next/link";
import Markdown from "react-markdown";
import Icon from "./Icon";
import ImageWithSkeleton from "./ImageWithSkeleton";

interface Props {
  project: Project;
}

export function ProjectCard({ project }: Props) {
  const { name, href, description, image, tags, links } = project;

  return (
    <Card className="flex flex-col overflow-hidden transition-shadow duration-300 hover:shadow-lg">
      <CardHeader className="p-0">
        {image && (
          <Link href={href || image} className="group relative overflow-hidden block">
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent z-10 transition-opacity duration-300 group-hover:from-black/40" />
            <ImageWithSkeleton
              src={image}
              alt={name}
              width={500}
              height={300}
              sizes="(max-width: 640px) calc(100vw - 4rem), 344px"
              quality={75}
              containerClassName="h-48 w-full"
              className="h-48 w-full object-cover object-center transition-transform duration-500 ease-out group-hover:scale-105"
            />
          </Link>
        )}
      </CardHeader>
      <CardContent className="flex flex-col gap-2 pt-6">
        <CardTitle className="transition-colors duration-200 group-hover:text-primary">{name}</CardTitle>
        <Markdown className="prose max-w-full text-pretty font-sans text-xs text-muted-foreground dark:prose-invert leading-relaxed">
          {description}
        </Markdown>
      </CardContent>
      <CardFooter className="flex h-full flex-col items-start justify-between gap-4">
        {tags && tags.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1">
            {tags.toSorted().map((tag) => (
              <Badge
                key={tag}
                className="px-1 py-0 text-[10px]"
                variant="secondary"
              >
                {tag}
              </Badge>
            ))}
          </div>
        )}
        {links && links.length > 0 && (
          <div className="flex flex-row flex-wrap items-start gap-1">
            {links.toSorted().map((link, idx) => (
              <Link href={link?.href} key={idx} target="_blank">
                <Badge key={idx} className="flex gap-2 px-2 py-1 text-[10px]">
                  <Icon name={link.icon} className="size-3" />
                  {link.name}
                </Badge>
              </Link>
            ))}
          </div>
        )}
      </CardFooter>
    </Card>
  );
}
