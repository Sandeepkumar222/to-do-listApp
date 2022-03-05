import {
  Button,
  FormControl,
  FormLabel,
  Image,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spinner,
  Stack,
  Text,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import React, { useState } from "react";
import { DataState } from "../context/DataProvider";

const Profile = ({ username, userEmail, userPic }) => {
  const { user, setUser } = DataState();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [edit, setEdit] = useState(false);
  const [pic, setPic] = useState(userPic);
  const [picLoading, setPicLoading] = useState(false);
  const toast = useToast();
  const [name, setName] = useState(username);
  const [email, setEmail] = useState(userEmail);

  const postPic = (pics) => {
    setPicLoading(true);
    if (pics === undefined) {
      toast({
        title: "Please Select an Image!",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setPicLoading(false);
      return;
    }
    console.log(pics);
    if (pics.type === "image/jpeg" || pics.type === "image/png") {
      const data = new FormData();
      data.append("file", pics);
      data.append("upload_preset", "chat-app-sandeep");
      data.append("cloud_name", "sandeepcloud");
      fetch("https://api.cloudinary.com/v1_1/sandeepcloud/image/upload", {
        method: "post",
        body: data,
      })
        .then((res) => res.json())
        .then((data) => {
          setPic(data.url.toString());
          console.log(data.url.toString());
          setPicLoading(false);
        })
        .catch((err) => {
          console.log(err);
          setPicLoading(false);
        });
    } else {
      toast({
        title: "Please Select an Image!",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setPicLoading(false);
      return;
    }
  };

  const putData = async () => {
    try {
      const config = {
        headers: {
          authorization: `Bearer ${user.token}`,
          "Content-Type": "application/json",
        },
      };
      const { data } = await axios.put(
        `/api/user/userEdit`,
        {
          pic: pic,
          name: name,
          email: email,
        },
        config
      );
      console.log(data, "put");
      if (data) {
        toast({
          title: "Profile modified successfully!",
          status: "success",
          duration: 3000,
          isClosable: true,
          position: "top",
        });
        await setUser({
          ...user,
          pic: pic,
          name: name,
          email: email,
        });
        localStorage.setItem(
          "userInfo",
          JSON.stringify({ ...data, token: user.token })
        );
        setEdit(false);
      }
    } catch (error) {
      toast({
        title: "failed to modify profile!",
        status: "Error",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
    }
  };

  return (
    <>
      <Button onClick={onOpen}>Profile</Button>

      {edit ? (
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Edit Profile</ModalHeader>
            <ModalCloseButton />
            <ModalBody boxSizing="content-box">
              <Stack direction="row" m={4}>
                <div>
                  {" "}
                  {picLoading ? (
                    <Spinner
                      thickness="4px"
                      speed="0.65s"
                      emptyColor="gray.200"
                      color="blue.500"
                      size="xl"
                    />
                  ) : (
                    <Image
                      borderRadius="full"
                      boxSize="150px"
                      objectFit="cover"
                      src={pic ? pic : user.pic}
                      alt={`${user.name}`}
                    />
                  )}
                  <FormControl id="pic">
                    <FormLabel>Upload your Picture</FormLabel>
                    <Input
                      type="file"
                      p={1.5}
                      accept="image/*"
                      onChange={(e) => postPic(e.target.files[0])}
                    />
                  </FormControl>
                </div>
                <Stack direction={"column"}>
                  <FormControl id="first-name" isRequired>
                    <FormLabel>Name</FormLabel>
                    <Input
                      value={name ? name : user.name}
                      placeholder="Enter Your Name"
                      onChange={(e) => setName(e.target.value)}
                    />
                  </FormControl>
                  <FormControl id="email" isRequired>
                    <FormLabel>Email Address</FormLabel>
                    <Input
                      value={email ? email : user.email}
                      type="email"
                      placeholder="Enter Your Email Address"
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </FormControl>
                </Stack>
              </Stack>
            </ModalBody>

            <ModalFooter>
              <Button colorScheme="blue" mr={3} onClick={onClose}>
                Close
              </Button>
              <Button
                variant="ghost"
                onClick={() => putData()}
                colorScheme={"cyan"}
              >
                Done
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      ) : (
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Your Profile</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Stack direction="row" m={4}>
                <Image
                  borderRadius="full"
                  boxSize="150px"
                  objectFit="cover"
                  src={pic ? pic : user.pic}
                  alt={`${user.name}`}
                />
                <Stack direction={"column"}>
                  <Text p={4}>
                    Name : <span className="font-weight-bold">{user.name}</span>
                  </Text>
                  <Text pl={4}>
                    Mail id :{" "}
                    <span className="font-weight-bold">{user.email}</span>
                  </Text>
                </Stack>
              </Stack>
            </ModalBody>

            <ModalFooter>
              <Button colorScheme="blue" mr={3} onClick={onClose}>
                Close
              </Button>
              <Button
                variant="ghost"
                onClick={() => setEdit(true)}
                colorScheme={"cyan"}
              >
                Edit
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}
    </>
  );
};

export default Profile;
