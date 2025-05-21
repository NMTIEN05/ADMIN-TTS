import React from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Table, Tag, Space, Button } from "antd";
import axios from "axios";

const UserList = () => {
  const reset = useQueryClient();
  const { data: users, isLoading } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const { data } = await axios.get("http://localhost:8888/auth/users");
      return data;
    },
  });

const { mutate } = useMutation({
  mutationFn: async (id: string) => {
    console.log("ID được truyền vào:", id);
    const { data } = await axios.delete(`http://localhost:8888/auth/users/${id}`);
    return data;
  },
  onSuccess: () => {
    alert("Xóa người dùng thành công");
    reset.invalidateQueries({ queryKey: ["users"] }); // Cách đúng trong react-query v4+
  },
  onError: (error) => {
    console.error(error);
    alert("Xóa người dùng thất bại");
  },
});


  const handleDelete = (id: string) => {
    if (confirm("Bạn có chắc chắn muốn xoá người dùng này không?")) {
      mutate(id);
    }
  };

  const columns = [
    {
      title: "STT",
      key: "stt",
      render: (_: any, __: any, index: number) => index + 1,
    },
    {
      title: "Họ tên",
      dataIndex: "fullname",
      key: "fullname",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Số điện thoại",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "Vai trò",
      dataIndex: "isAdmin",
      key: "isAdmin",
      render: (isAdmin: boolean) => (
        <Tag color={isAdmin ? "red" : "blue"}>{isAdmin ? "ADMIN" : "CLIENT"}</Tag>
      ),
    },
    {
      title: "Hành động",
      key: "action",
      render: (_: any, record: any) => (
        <Space>
          <Button type="link">Sửa</Button>
          <Button type="link" danger onClick={() => handleDelete(record._id)}>
            Xoá
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div
      style={{
        padding: 24,
        background: "#fff",
        borderRadius: 8,
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
        minHeight: "100%",
      }}
    >
      <h1
        style={{
          margin: 0,
          fontSize: 24,
          fontWeight: 600,
          borderBottom: "2px solid #f0f0f0",
          paddingBottom: 8,
          color: "#1890ff",
          marginBottom: 16,
        }}
      >
        Danh sách người dùng
      </h1>

      <div style={{ marginBottom: 16 }}>
        <Button style={{ marginRight: 1100 }} type="primary">
          Thêm người dùng
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={users}
        loading={isLoading}
        rowKey={(record) => record._id || record.id || record.username}
      />
    </div>
  );
};

export default UserList;
