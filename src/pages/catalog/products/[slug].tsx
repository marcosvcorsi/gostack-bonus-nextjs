import  dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { useState } from 'react';
;

const AddToCartModal = dynamic(() => import('@/components/AddToCartModal'), { loading: () => <p>Carregando</p> })

export default function Product() {
  const router = useRouter();
  
  const [isAddToCartModalVisible, setIsAddToCartModalVisible] = useState(false); 

  const handleAddToCart = () => {
    setIsAddToCartModalVisible(true);
  }

  return (
    <div>
      <h1>{router.query.slug}</h1>

      <button onClick={handleAddToCart}>Add to cart</button>

      { isAddToCartModalVisible && <AddToCartModal />}
    </div>
  )
}