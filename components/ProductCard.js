// components/ProductCard.js
import Link from 'next/link';
import Image from 'next/image';

const ProductCard = ({ product, onAddToCart, isAuthenticated }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <Link href={`/products/${product.id}`}>
        <div className="relative h-48 w-full cursor-pointer">
          <Image
            src={product.imageUrl}
            alt={product.name}
            layout="fill"
            objectFit="cover"
            className="rounded-t-lg"
          />
        </div>
      </Link>
      <div className="p-4">
        <Link href={`/products/${product.id}`}>
          <h3 className="text-lg font-semibold text-gray-800 hover:text-blue-600 cursor-pointer line-clamp-2">
            {product.name}
          </h3>
        </Link>
        <p className="text-gray-600 mt-1">Rp {product.price.toLocaleString('id-ID')}</p>
        <p className="text-sm text-gray-500">Stok: {product.stock}</p>
        <button
          onClick={() => onAddToCart(product.id)}
          disabled={!isAuthenticated || product.stock === 0}
          className={`mt-4 w-full py-2 rounded text-white font-semibold
            ${isAuthenticated && product.stock > 0
              ? 'bg-blue-600 hover:bg-blue-700'
              : 'bg-gray-400 cursor-not-allowed'}
          `}
        >
          {isAuthenticated ? (product.stock > 0 ? 'Tambah ke Keranjang' : 'Stok Habis') : 'Login untuk Beli'}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;