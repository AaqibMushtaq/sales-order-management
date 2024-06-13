import React, { useState, useEffect } from "react";
import {
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Flex,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
  useDisclosure,
  Box,
  Select,
  Radio,
  RadioGroup,
  Stack,
  Text,
} from "@chakra-ui/react";

// Define the types for the JSON data
interface CustomerProfile {
  id: number;
  name: string;
  email: string;
  pincode: string;
  location_name: string;
  type: string;
  profile_pic: string | null;
}

interface Distributor {
  id: number;
  distID: number;
  customer_profile: CustomerProfile;
}

interface SKU {
  id: number;
  selling_price: number;
  max_retail_price: number;
  amount: number;
  unit: string;
  quantity_in_inventory: number;
}

interface Product {
  id: number;
  display_id: number;
  owner: number;
  name: string;
  category: string;
  characteristics: string;
  brand: string;
  sku: SKU[];
  updated_on: string;
  adding_date: string;
}

const TabsComponent = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [formData, setFormData] = useState({
    customerName: "",
    customerEmail: "",
    paid: "false", // default value for paid
    products: [] as { productName: string; skuId: number }[],
    sellingRates: {} as { [key: string]: string },
    totalItems: {} as { [key: string]: string },
  });
  const [salesOrderPerson, setSalesOrderPerson] = useState<Distributor | null>(
    null
  );
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    // Fetch the JSON data from the public folder
    fetch("/data.json")
      .then((response) => response.json())
      .then((data) => {
        setSalesOrderPerson(data.distributor[0]); // assuming you want the first distributor
        setProducts(data.products);
      })
      .catch((error) => console.error("Error fetching the JSON data:", error));
  }, []);

  const handleProductChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedProductName = e.target.value;
    const selectedProduct = products.find(
      (product) => product.name === selectedProductName
    );

    if (selectedProduct) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        products: [
          ...prevFormData.products,
          {
            productName: selectedProduct.name,
            skuId: selectedProduct.sku[0].id,
          },
        ],
      }));
    }
  };

  const handleSellingRateChange = (productName: string, value: string) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      sellingRates: {
        ...prevFormData.sellingRates,
        [productName]: value,
      },
    }));
  };

  const handleTotalItemsChange = (productName: string, value: string) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      totalItems: {
        ...prevFormData.totalItems,
        [productName]: value,
      },
    }));
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handlePaidChange = (value: string) => {
    setFormData({
      ...formData,
      paid: value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log(formData);
    onClose();
  };

  if (!salesOrderPerson) return <p>Loading...</p>;

  return (
    <Flex justify="space-between">
      <Tabs variant="soft-rounded" colorScheme="green">
        <TabList>
          <Flex direction="row" gap="20px">
            <Tab
              p={2}
              borderRadius="lg"
              fontSize="medium"
              borderWidth="thin"
              borderColor="black"
            >
              Active Sale Orders
            </Tab>
            <Tab
              p={2}
              borderRadius="lg"
              fontSize="medium"
              borderWidth="thin"
              borderColor="black"
            >
              Completed Sale Orders
            </Tab>
          </Flex>
        </TabList>
        <TabPanels>
          <TabPanel>
            <p>This is description for Tab1</p>
          </TabPanel>
          <TabPanel>
            <p>This is description for Tab2</p>
          </TabPanel>
        </TabPanels>
      </Tabs>
      <Button
        borderRadius="lg"
        borderColor="black"
        borderWidth="thin"
        p={2}
        onClick={onOpen}
      >
        + Sale Order
      </Button>

      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create Sale Order</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {/* Display Sales Order Person's Details */}
            <Box mb={4}>
              <Text fontSize="lg" fontWeight="bold">
                Sales Order Person Details
              </Text>
              <Text>Name: {salesOrderPerson.customer_profile.name}</Text>
              <Text>
                Address: {salesOrderPerson.customer_profile.location_name}
              </Text>
              <Text>Email: {salesOrderPerson.customer_profile.email}</Text>
            </Box>

            {/* New fields for Customer Details */}
            <FormControl id="customerName" isRequired mt={4}>
              <FormLabel>Customer Name</FormLabel>
              <Input
                name="customerName"
                placeholder="Enter customer name"
                value={formData.customerName}
                onChange={handleInputChange}
              />
            </FormControl>

            <FormControl id="customerEmail" isRequired mt={4}>
              <FormLabel>Customer Email</FormLabel>
              <Input
                name="customerEmail"
                placeholder="Enter customer email"
                value={formData.customerEmail}
                onChange={handleInputChange}
              />
            </FormControl>

            <FormControl id="productName" isRequired mb={4}>
              <FormLabel>All Products</FormLabel>
              <Select
                placeholder="Select product"
                name="productName"
                onChange={handleProductChange}
              >
                {products.map((product) => (
                  <option key={product.id} value={product.name}>
                    {product.name}
                  </option>
                ))}
              </Select>
            </FormControl>

            {formData.products.map((product, index) => (
              <Box key={index} mt={4} p={4} borderWidth="1px" borderRadius="lg">
                <Box mb={4}>
                  <Box>
                    <FormLabel>
                      SKU ({product.skuId}) - {product.productName}
                    </FormLabel>
                  </Box>
                </Box>
                <FormControl id="sellingRate" isRequired mb={4}>
                  <FormLabel>Selling Rate</FormLabel>
                  <Input
                    name={`sellingRate-${product.productName}`}
                    placeholder="Enter selling rate"
                    value={formData.sellingRates[product.productName] || ""}
                    onChange={(e) =>
                      handleSellingRateChange(
                        product.productName,
                        e.target.value
                      )
                    }
                  />
                </FormControl>

                <FormControl id="totalItems" isRequired>
                  <FormLabel>Total Items</FormLabel>
                  <Input
                    name={`totalItems-${product.productName}`}
                    placeholder="Enter quantity"
                    value={formData.totalItems[product.productName] || ""}
                    onChange={(e) =>
                      handleTotalItemsChange(
                        product.productName,
                        e.target.value
                      )
                    }
                  />
                </FormControl>
              </Box>
            ))}

            <FormControl as="fieldset" mt={4}>
              <FormLabel as="legend">Paid</FormLabel>
              <RadioGroup
                name="paid"
                value={formData.paid}
                onChange={handlePaidChange}
              >
                <Stack direction="row">
                  <Radio value="true">True</Radio>
                  <Radio value="false">False</Radio>
                </Stack>
              </RadioGroup>
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleSubmit}>
              Submit
            </Button>
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Flex>
  );
};

export default TabsComponent;
