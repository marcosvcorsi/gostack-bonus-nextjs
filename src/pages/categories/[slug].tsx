import { client } from '@/lib/prismic';
import Link from 'next/link'
import Prismic from 'prismic-javascript';
import PrismicDOM from 'prismic-dom';
import { Document } from 'prismic-javascript/types/documents'
import { GetStaticPaths, GetStaticProps } from 'next';
import { useRouter } from 'next/router';

interface CategoryProps {
  category: Document,
  products: Document[];
}

export default function Category({ products, category }: CategoryProps) {
  const router = useRouter();

  if(router.isFallback) {
    return <p>Carregando</p>
  }
  
  return (
    <div>
    <h1>
      {PrismicDOM.RichText.asText(category.data.title)}
    </h1>

    <ul>
      {products.map(product => (
        <li key={product.id}>
          <Link href={`/catalog/products/${product.uid}`}>
            <a>
              {PrismicDOM.RichText.asText(product.data.title)}
            </a>
          </Link>
        </li>
      ))}
    </ul>
  </div>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  const categories = await client().query([
    Prismic.Predicates.at('document.type', 'category'),
  ])

  return {
    paths: categories.results.map(category => ({ params: { slug: category.uid}})),
    fallback: true
  }
}
 
export const getStaticProps: GetStaticProps<CategoryProps> = async (context) => {
  const { slug } = context.params;

  const category = await client().getByUID('category', String(slug), {});

  const products = await client().query([
    Prismic.Predicates.at('document.type', 'product'),
    Prismic.Predicates.at('my.product.category', category.id)
  ])


  return {
    props: {
      category,
      products: products.results
    },
    revalidate: 60
  }
}