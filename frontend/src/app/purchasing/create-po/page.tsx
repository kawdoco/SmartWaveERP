import Link from "next/link";

type Supplier = {
  id: string;
  name: string;
};

type Product = {
  id: string;
  name: string;
};

async function getSuppliers(): Promise<Supplier[]> {
  try {
    const res = await fetch("http://localhost:8080/api/suppliers", {
      cache: "no-store",
    });

    if (!res.ok) {
      return [];
    }

    return await res.json();
  } catch (error) {
    console.error("Error fetching suppliers:", error);
    return [];
  }
}

async function getProducts(): Promise<Product[]> {
  try {
    const res = await fetch("http://localhost:8080/api/products", {
      cache: "no-store",
    });

    if (!res.ok) {
      return [];
    }

    return await res.json();
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
}

export default async function CreatePurchaseOrderPage() {
  const suppliers = await getSuppliers();
  const products = await getProducts();

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#F8FAFC",
        padding: "32px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "900px",
          backgroundColor: "#FFFFFF",
          border: "1px solid #E2E8F0",
          borderRadius: "28px",
          padding: "40px",
          boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
        }}
      >
        <h1
          style={{
            fontSize: "32px",
            fontWeight: "bold",
            color: "#0F172A",
            marginBottom: "40px",
          }}
        >
          Create Purchase Order
        </h1>

        <div style={{ marginBottom: "40px" }}>
          <label
            style={{
              display: "block",
              fontSize: "20px",
              fontWeight: 600,
              color: "#0F172A",
              marginBottom: "12px",
            }}
          >
            Select Supplier
          </label>

          <select
            style={{
              width: "100%",
              padding: "16px 20px",
              fontSize: "18px",
              borderRadius: "16px",
              border: "1px solid #1E293B",
              backgroundColor: "#FFFFFF",
              color: "#1E293B",
              outline: "none",
            }}
            defaultValue=""
          >
            <option value="" disabled>
              Choose a supplier...
            </option>
            {suppliers.map((supplier) => (
              <option key={supplier.id} value={supplier.id}>
                {supplier.name}
              </option>
            ))}
          </select>
        </div>

        <div
          style={{
            marginBottom: "48px",
            border: "1px solid #1E293B",
            borderRadius: "24px",
            overflow: "hidden",
            backgroundColor: "#FFFFFF",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "20px",
            }}
          >
            <h2
              style={{
                fontSize: "20px",
                fontWeight: "bold",
                color: "#0F172A",
                margin: 0,
              }}
            >
              Order Items
            </h2>

            <select
              style={{
                padding: "10px 16px",
                borderRadius: "12px",
                border: "1px solid #1E293B",
                fontSize: "16px",
                backgroundColor: "#FFFFFF",
                color: "#1E293B",
              }}
              defaultValue=""
            >
              <option value="" disabled>
                Add Product...
              </option>
              {products.map((product) => (
                <option key={product.id} value={product.id}>
                  {product.name}
                </option>
              ))}
            </select>
          </div>

          <div
            style={{
              borderTop: "1px solid #E2E8F0",
              padding: "16px 20px",
            }}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "2fr 1fr 1fr 1fr",
                fontSize: "14px",
                fontWeight: 600,
                textTransform: "uppercase",
                color: "#64748B",
              }}
            >
              <p>Product</p>
              <p>Qty</p>
              <p>Unit Price</p>
              <p>Total</p>
            </div>
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "20px",
          }}
        >
          <Link
            href="/purchasing"
            style={{
              textAlign: "center",
              padding: "18px",
              borderRadius: "16px",
              border: "1px solid #1E293B",
              backgroundColor: "#FFFFFF",
              color: "#0F172A",
              fontSize: "18px",
              textDecoration: "none",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            Cancel
          </Link>

          <button
            style={{
              padding: "18px",
              borderRadius: "16px",
              backgroundColor: "#0A2540",
              color: "#FFFFFF",
              fontSize: "18px",
              border: "none",
              cursor: "pointer",
            }}
          >
            Submit PO
          </button>
        </div>
      </div>
    </div>
  );
}