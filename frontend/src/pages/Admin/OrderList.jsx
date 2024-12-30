import Message from "../../components/Message";
import Loader from "../../components/Loader";
import { Link } from "react-router-dom";
import { useGetOrdersQuery, useDeleteOrderMutation } from "../../redux/api/orderApiSlice";
import AdminMenu from "./AdminMenu";

const OrderList = () => {
  const [deleteOrder, { isLoading: isDeleting }] = useDeleteOrderMutation();
  const { data: orders, isLoading, error } = useGetOrdersQuery();


  const handleDelete = async (orderId) => {
    if (window.confirm("Are you sure you want to delete this order?")) {
      try {
        await deleteOrder(orderId).unwrap();
        alert("Order deleted successfully!");
      } catch (error) {
        console.error("Failed to delete order:", error);
        alert("Error deleting order.");
      }
    }
  };

  return (
    <div className="px-20">
      <AdminMenu />
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error?.data?.message || error.error}</Message>
      ) : orders.length === 0 ? (
        <Message variant="info">No orders found</Message>
      ) : (
        <table className="container mx-auto overflow-x-auto border border-gray-200">
          <thead>
            <tr>
              <th className="text-left pl-1">ITEMS</th>
              <th className="text-left pl-1">ID</th>
              <th className="text-left pl-1">USER</th>
              <th className="text-left pl-1">DATE</th>
              <th className="text-left pl-1">TOTAL</th>
              <th className="text-left pl-1">PAID</th>
              <th className="text-left pl-1">DELIVERED</th>
              <th className="text-left pl-1">CANCEL</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id}>
                <td>
                  <img
                    src={order.orderItems[0].image}
                    alt={order._id}
                    className="w-[5rem] pt-4"
                  />
                </td>
                <td>{order._id}</td>
                <td>{order.user ? order.user.username : "N/A"}</td>
                <td>{order.createdAt ? new Date(order.createdAt).toLocaleDateString() : "N/A"}</td>
                <td>$ {order.totalPrice}</td>
                <td>
                  {order.isPaid ? (
                    <p className="p-1 text-center bg-green-400 w-[6rem] rounded-full">Completed</p>
                  ) : (
                    <p className="p-1 text-center bg-red-400 w-[6rem] rounded-full">Pending</p>
                  )}
                </td>
                <td>
                  {order.isDelivered ? (
                    <p className="p-1 text-center bg-green-400 w-[6rem] rounded-full">Completed</p>
                  ) : (
                    <p className="p-1 text-center bg-red-400 w-[6rem] rounded-full">Pending</p>
                  )}
                </td>
                <td>
                  <button
                    onClick={() => handleDelete(order._id)}
                    className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition duration-200"
                    disabled={isDeleting}
                  >
                    {isDeleting ? "Deleting..." : "Delete"}
                  </button>
                </td>
                <td>
                  <Link to={`/order/${order._id}`}>
                    <button className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-200">
                      More
                    </button>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default OrderList;
