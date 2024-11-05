import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Tshirt {
  id: number;
  name: string;
  brand: string;
  size: string;
  price: number;
  quantity: number;
  reference: string;
}

interface TshirtTableProps {
  tshirts: Tshirt[];
  onEdit: (id: number, field: keyof Tshirt, value: string | number) => void;
  onDelete: (id: number) => void;
}

export function TshirtTable({ tshirts, onEdit, onDelete }: TshirtTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow className="font-bold text-lg">
          <TableHead>Name</TableHead>
          <TableHead>Brand</TableHead>
          <TableHead>Size</TableHead>
          <TableHead>Price</TableHead>
          <TableHead>Quantity</TableHead>
          <TableHead>Reference</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {tshirts.map((tshirt) => (
          <TableRow key={tshirt.id}>
            <TableCell>{tshirt.name}</TableCell>
            <TableCell>{tshirt.brand}</TableCell>
            <TableCell>{tshirt.size}</TableCell>
            <TableCell>
              <Input
                type="number"
                value={tshirt.price}
                onChange={(e) =>
                  onEdit(tshirt.id, "price", parseFloat(e.target.value))
                }
                className="w-20"
              />
            </TableCell>
            <TableCell>
              <Input
                type="number"
                value={tshirt.quantity}
                onChange={(e) =>
                  onEdit(tshirt.id, "quantity", parseInt(e.target.value))
                }
                className="w-20"
              />
            </TableCell>
            <TableCell>{tshirt.reference}</TableCell>
            <TableCell>
              <Button onClick={() => onDelete(tshirt.id)} variant="destructive">
                Delete
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
