import { useState } from 'react';
import { Rate, InputNumber, Button, Tag } from 'antd';
import styled from 'styled-components';
import { formatVietnamCurrency } from '~/utils';
import { useCartContext } from '~/contexts/CartProvider';
import { useFirestoreQuery } from '~/hooks';
import { query, where, getFirestore, collection } from 'firebase/firestore';

const ProductEntry = ({ product }) => {
  const { cart, addToCart } = useCartContext();
  const [productQuantity, setProductQuantity] = useState(1);
  // console.log(cart);
  // console.log(productQuantity);
  const firestore = getFirestore();
  const inventoriesRef = collection(firestore, 'inventories');
  const q = query(inventoriesRef, where('productId', '==', product?.productId));
  const [[inventory]] = useFirestoreQuery(q);

  return (
    <Container>
      <h3>{product?.title}</h3>
      <p>
        <span>Thương hiệu: </span>
        <span className="brand">{product?.brand}</span>
        <span> | </span>
        <span>Tình trạng: </span>
        <Tag>
          {(inventory?.stock > 0 && `Còn ${inventory?.stock} sản phẩm`) ||
            'Hết hàng'}
        </Tag>
      </p>
      <Rate defaultValue={product?.rating} disabled={true} />
      <p className="price">{formatVietnamCurrency(inventory?.price)}</p>
      <p className="description">{product?.description}</p>
      <div className="product-control">
        <label htmlFor="quantity-input">
          <span className="quantity-label">Số lượng: </span>
          <InputNumber
            id="quantity-input"
            min={1}
            defaultValue={1}
            value={productQuantity}
            onChange={(value) => setProductQuantity(value)}
          />
        </label>
        <Button
          type="primary"
          onClick={() => {
            addToCart();
          }}
        >
          Thêm vào giỏ hàng
        </Button>
      </div>
      <div className="additional-info">
        <div className="additional-info-group">
          <span>Danh mục: </span>
          {product?.categories?.map((category) => {
            return <Tag key={category}>{category}</Tag>;
          })}
        </div>
      </div>
    </Container>
  );
};

const Container = styled.div`
  h3 {
    font-size: var(--fs-h3);
    font-weight: 700;
    margin: 0;
  }

  .price {
    color: var(--ant-primary-color);
    font-size: 1.2rem;
    font-weight: 700;
  }

  .description {
  }

  .product-control {
    display: flex;
    gap: 10px;
    align-items: center;
  }

  .quantity-label {
    color: var(--ant-primary-color);
    font-weight: 700;
    font-size: 1rem;
  }

  .additional-info {
    margin-top: 20px;
    font-size: 1rem;
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .brand {
    color: var(--ant-primary-color);
  }
`;

export default ProductEntry;
