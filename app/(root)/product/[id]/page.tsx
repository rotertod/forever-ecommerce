import Product from '@/components/client/Product';
import { getProductById } from '@/lib/actions/product.action';

interface DetailsProductsPageProps {
    params: Promise<{
        id: string;
    }>;
}

export default async function DetailsProductPage({ params }: DetailsProductsPageProps) {
    const { id } = await params;
    const product = await getProductById(id);

    return (
        <div>
            <Product product={product} />
        </div>
    );
}
