export class CreateCartDto {
  orderId: string;
  orderNumber: string;
  orderName: string;
  orderType: string;
  items: any[];
  status: string;
  options: Record<string, any>;
  editLink: string;
  createdAt: string;
}

