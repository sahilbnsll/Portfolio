import { Experience } from "@/lib/schemas";
import TimelineItem from "./TimelineItem";
import { Card, CardContent } from "./ui/Card";

interface Props {
  experience: Experience[];
  type?: "work" | "education";
}

export default function Timeline({ experience, type = "work" }: Props) {
  return (
    <Card>
      <CardContent className="p-0">
        <ul className="ml-10 border-l">
          {experience.map((exp, id) => (
            <TimelineItem key={id} experience={exp} type={type} />
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
