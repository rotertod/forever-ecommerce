import UpdateProduct from '@/components/admin/UpdateProduct';

interface UpdateProductPageProps {
    params: Promise<{
        id: string;
    }>;
}

export default async function UpdateProductPage({ params }: UpdateProductPageProps) {
    const { id } = await params;

    return (
        <div className="px-16 py-8 w-full">
            <UpdateProduct id={id} />
        </div>
    );
}
