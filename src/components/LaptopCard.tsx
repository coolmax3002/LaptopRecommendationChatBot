import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Laptop } from "@/types/laptops";

interface LaptopCardProps {
  laptop: Laptop;
}

export const LaptopCard: React.FC<LaptopCardProps> = ({ laptop }) => {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{laptop.name}</CardTitle>
          </div>
          <Badge variant="secondary" className="text-lg font-bold">
            ${laptop.price}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <span className="text-muted-foreground">OS:</span>
            <span className="ml-2 font-medium">{laptop.os}</span>
          </div>
          <div>
            <span className="text-muted-foreground">Screen:</span>
            <span className="ml-2 font-medium">{laptop.screenSize}"</span>
          </div>
          <div>
            <span className="text-muted-foreground">Storage:</span>
            <span className="ml-2 font-medium">{laptop.storage}GB</span>
          </div>
          {laptop.gpu && (
            <div>
              <span className="text-muted-foreground">GPU:</span>
              <span className="ml-2 font-medium">{laptop.gpu}</span>
            </div>
          )}
        </div>
        <div className="flex flex-wrap gap-2 mt-4">
          {laptop.useCase.map((use) => (
            <Badge key={use} variant="outline">{use}</Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};