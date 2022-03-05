import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Tab,
  Table,
  TableCaption,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { DataState } from "../context/DataProvider";
import axios from "axios";
import DateMomentUtils from "@date-io/moment";
import { DateTimePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import Header from "./Header";

const About = () => {
  const { user, tasks, setTasks } = DataState();
  const toast = useToast();
  const [addTask, setAddTask] = useState(false);
  const [date, setDate] = useState(new Date());
  const [taskTitle, setTaskTitle] = useState();
  const [comment, setComment] = useState();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedTask, setSelectedTask] = useState();

  useEffect(async () => {
    await getData();
  }, []);

  const getData = async () => {
    let user1 = JSON.parse(localStorage.getItem("userInfo"));
    try {
      const config = {
        headers: {
          authorization: `Bearer ${user1.token}`,
          "Content-Type": "application/json",
        },
      };
      const { data } = await axios.get(`/api/user/tasks`, config);
      setTasks(data[0].tasks);
      setAddTask(false);
      console.log(data, "get");
    } catch (error) {
      console.log(error);
      toast({
        title: "failed to fetch tasks!",
        status: "Error",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
    }
  };

  const handleDelete = async (delTask) => {
    if (!delTask) {
      return toast({
        title: "failed to delete task due to no id!",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
    }

    try {
      // const { data } = await axios.delete(
      //   `/api/user/tasks`,
      //   {
      //     id: delTask._id,
      //   },
      //   config
      // );
      let { data } = await axios({
        url: `/api/user/tasks`,
        method: "delete",
        data: { id: delTask._id },
        headers: {
          authorization: `Bearer ${user.token}`,
          "Content-Type": "application/json",
        },
      });
      setTasks(data.tasks);
      if (data) {
        toast({
          title: "Task deleted successfully!",
          status: "success",
          duration: 3000,
          isClosable: true,
          position: "top",
        });
      }
    } catch (error) {
      console.log(error);
      toast({
        title: "failed to delete task!",
        status: "Error",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
    }
  };

  const handleComplete = async (task) => {
    let modifiedTasks = tasks.map((e) => {
      if (e === task) {
        e.completed = true;
        return e;
      }
      return e;
    });
    await putData(modifiedTasks);
  };

  const handleEdit = async () => {
    console.log(selectedTask);
    let modified = tasks.map((e) => {
      if (e._id === selectedTask._id) {
        return selectedTask;
      }
      return e;
    });
    await putData(modified);
  };

  const putData = async (mTasks) => {
    try {
      const config = {
        headers: {
          authorization: `Bearer ${user.token}`,
          "Content-Type": "application/json",
        },
      };
      const { data } = await axios.put(
        `/api/user/tasks`,
        {
          tasks: mTasks,
        },
        config
      );
      setTasks(data.tasks);
      console.log(data, "put");
      if (data) {
        toast({
          title: "Task modified successfully!",
          status: "success",
          duration: 3000,
          isClosable: true,
          position: "top",
        });
      }
    } catch (error) {
      toast({
        title: "failed to modify task!",
        status: "Error",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
    }
  };

  const handleSubmit = async () => {
    if (!taskTitle || !comment || !date) {
      return toast({
        title: "failed to add task!",
        description: "Please fill all fields",
        status: "warning",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
    }
    try {
      const config = {
        headers: {
          authorization: `Bearer ${user.token}`,
          "Content-Type": "application/json",
        },
      };
      const { data } = await axios.post(
        `/api/user/tasks`,
        {
          tasks: {
            taskTitle: taskTitle,
            taskComment: comment,
            lastDate: date,
          },
        },
        config
      );
      console.log(data, "post");
      setTasks(data.tasks);
      setAddTask(false);

      if (data) {
        toast({
          title: "Task added successfully!",
          status: "success",
          duration: 3000,
          isClosable: true,
          position: "top",
        });
      }
    } catch (error) {
      toast({
        title: "failed to add task!",
        status: "Error",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
    }
  };
  return (
    <>
      <Header></Header>
      <Box marginTop={"3"} align="center" justifyContent={"center"}>
        {addTask ? (
          <Box boxShadow={"dark-lg"} p="4" m="3" borderRadius={"2xl"}>
            <FormControl>
              <FormLabel>Date & time of completion</FormLabel>
              <MuiPickersUtilsProvider utils={DateMomentUtils}>
                <DateTimePicker value={date} onChange={setDate} />
              </MuiPickersUtilsProvider>
            </FormControl>
            <br></br>
            <FormControl id="email" isRequired>
              <FormLabel>Task title</FormLabel>
              <Input
                type="text"
                placeholder="Enter your new task"
                onChange={(e) => setTaskTitle(e.target.value)}
              />
            </FormControl>
            <br></br>
            <FormControl id="text" isRequired>
              <FormLabel>Task comment</FormLabel>
              <Input
                type="text"
                placeholder="Enter your comment new task"
                onChange={(e) => setComment(e.target.value)}
              />
            </FormControl>
            <br></br>
            <Button colorScheme="red" mr={3} onClick={() => setAddTask(false)}>
              Close
            </Button>
            <Button
              variant="ghost"
              type="submit"
              colorScheme={"messenger"}
              onClick={handleSubmit}
            >
              Add task
            </Button>
          </Box>
        ) : (
          <Button onClick={() => setAddTask(true)} colorScheme={"messenger"}>
            Add Task
          </Button>
        )}

        <div>
          {" "}
          <Tabs
            size="lg"
            align="center"
            variant="soft-rounded"
            colorScheme="linkedin"
            boxShadow={"dark-lg"}
            p="4"
            m="3"
            borderRadius={"2xl"}
            boxSize="-webkit-fit-content"
          >
            <TabList>
              <Tab>Ongoing Tasks</Tab>
              <Tab>Completed Tasks</Tab>
              <Tab>Breached Tasks </Tab>
            </TabList>
            <TabPanels>
              <TabPanel textOverflow={"clip"}>
                <p>Ongoing</p>
                <Table variant="simple">
                  <TableCaption>Tasks are ongoing!</TableCaption>
                  <Thead>
                    <Tr>
                      <Th>Title</Th>
                      <Th>Comment</Th>
                      <Th>Date of completion</Th>
                      <Th>Mark as completed</Th>
                      <Th>Edit the Task</Th>
                      <Th>Delete the task</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {tasks ? (
                      tasks.map((e) => {
                        if (
                          e.completed === false &&
                          new Date(e.lastDate).getTime() > new Date().getTime()
                        )
                          return (
                            <Tr key={e._id}>
                              <Td>{e.taskTitle}s</Td>
                              <Td>{e.taskComment}</Td>
                              <Td>{e.lastDate.split("T").join(" ")}</Td>
                              <Td>
                                <Button
                                  colorScheme={"linkedin"}
                                  onClick={() => handleComplete(e)}
                                >
                                  Completed
                                </Button>
                              </Td>
                              <Td>
                                <Button
                                  onClick={() => {
                                    setSelectedTask(e);
                                    onOpen();
                                  }}
                                  colorScheme="telegram"
                                >
                                  Edit
                                </Button>

                                <Modal isOpen={isOpen} onClose={onClose}>
                                  <ModalOverlay />
                                  <ModalContent>
                                    <ModalHeader></ModalHeader>
                                    <ModalCloseButton />
                                    <ModalBody>
                                      <FormControl>
                                        <FormLabel>
                                          Date & time of completion
                                        </FormLabel>
                                        <input
                                          type={"datetime-local"}
                                          value={
                                            selectedTask
                                              ? selectedTask.lastDate
                                              : date
                                          }
                                          onChange={(e) =>
                                            setSelectedTask({
                                              ...selectedTask,
                                              lastDate: e.target.value,
                                            })
                                          }
                                        />
                                      </FormControl>
                                      <br></br>
                                      <FormControl id="email" isRequired>
                                        <FormLabel>Task title</FormLabel>
                                        <Input
                                          value={
                                            selectedTask
                                              ? selectedTask.taskTitle
                                              : ""
                                          }
                                          type="text"
                                          placeholder="Enter your new task"
                                          onChange={(e) =>
                                            setSelectedTask({
                                              ...selectedTask,
                                              taskTitle: e.target.value,
                                            })
                                          }
                                        />
                                      </FormControl>
                                      <br></br>
                                      <FormControl id="text" isRequired>
                                        <FormLabel>Task comment</FormLabel>
                                        <Input
                                          value={
                                            selectedTask
                                              ? selectedTask.taskComment
                                              : ""
                                          }
                                          type="text"
                                          placeholder="Enter your comment new task"
                                          onChange={(e) =>
                                            setSelectedTask({
                                              ...selectedTask,
                                              taskComment: e.target.value,
                                            })
                                          }
                                        />
                                      </FormControl>
                                    </ModalBody>

                                    <ModalFooter>
                                      <Button
                                        colorScheme="blue"
                                        mr={3}
                                        onClick={onClose}
                                      >
                                        Close
                                      </Button>
                                      <Button
                                        variant="ghost"
                                        colorScheme="blue"
                                        onClick={() => {
                                          handleEdit();
                                          onClose();
                                        }}
                                      >
                                        Done
                                      </Button>
                                    </ModalFooter>
                                  </ModalContent>
                                </Modal>
                              </Td>
                              <Td>
                                <Button
                                  colorScheme={"red"}
                                  onClick={() => handleDelete(e)}
                                >
                                  Delete
                                </Button>
                              </Td>
                            </Tr>
                          );
                      })
                    ) : (
                      <Text>No Ongoing tasks</Text>
                    )}
                  </Tbody>
                </Table>
              </TabPanel>
              <TabPanel>
                <Table variant="simple">
                  <TableCaption>Tasks Completed!</TableCaption>
                  <Thead>
                    <Tr>
                      <Th>Title</Th>
                      <Th>Comment</Th>
                      <Th>Date of completion</Th>
                      <Th>Delete the task</Th>
                      <Th>Edit the task</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    <p>Completed</p>
                    {tasks ? (
                      tasks.map((e) => {
                        if (e.completed === true)
                          return (
                            <Tr key={e._id}>
                              <Td>{e.taskTitle}s</Td>
                              <Td>{e.taskComment}</Td>
                              <Td>{e.lastDate.split("T").join(" ")}</Td>
                              <Td>
                                <Button
                                  colorScheme={"red"}
                                  onClick={() => handleDelete(e)}
                                >
                                  Delete
                                </Button>
                              </Td>
                              <Td>
                                <Button
                                  onClick={() => {
                                    setSelectedTask(e);
                                    onOpen();
                                  }}
                                  colorScheme="telegram"
                                >
                                  Edit
                                </Button>

                                <Modal isOpen={isOpen} onClose={onClose}>
                                  <ModalOverlay />
                                  <ModalContent>
                                    <ModalHeader></ModalHeader>
                                    <ModalCloseButton />
                                    <ModalBody>
                                      <FormControl>
                                        <FormLabel>
                                          Date & time of completion
                                        </FormLabel>
                                        <input
                                          type={"datetime-local"}
                                          value={
                                            selectedTask
                                              ? selectedTask.lastDate
                                              : date
                                          }
                                          onChange={(e) =>
                                            setSelectedTask({
                                              ...selectedTask,
                                              lastDate: e.target.value,
                                            })
                                          }
                                        />
                                      </FormControl>
                                      <br></br>
                                      <FormControl id="email" isRequired>
                                        <FormLabel>Task title</FormLabel>
                                        <Input
                                          value={
                                            selectedTask
                                              ? selectedTask.taskTitle
                                              : ""
                                          }
                                          type="text"
                                          placeholder="Enter your new task"
                                          onChange={(e) =>
                                            setSelectedTask({
                                              ...selectedTask,
                                              taskTitle: e.target.value,
                                            })
                                          }
                                        />
                                      </FormControl>
                                      <br></br>
                                      <FormControl id="text" isRequired>
                                        <FormLabel>Task comment</FormLabel>
                                        <Input
                                          value={
                                            selectedTask
                                              ? selectedTask.taskComment
                                              : ""
                                          }
                                          type="text"
                                          placeholder="Enter your comment new task"
                                          onChange={(e) =>
                                            setSelectedTask({
                                              ...selectedTask,
                                              taskComment: e.target.value,
                                            })
                                          }
                                        />
                                      </FormControl>
                                    </ModalBody>

                                    <ModalFooter>
                                      <Button
                                        colorScheme="blue"
                                        mr={3}
                                        onClick={onClose}
                                      >
                                        Close
                                      </Button>
                                      <Button
                                        variant="ghost"
                                        colorScheme="blue"
                                        onClick={() => {
                                          handleEdit();
                                          onClose();
                                        }}
                                      >
                                        Done
                                      </Button>
                                    </ModalFooter>
                                  </ModalContent>
                                </Modal>
                              </Td>
                            </Tr>
                          );
                      })
                    ) : (
                      <Text>No completed tasks</Text>
                    )}
                  </Tbody>
                </Table>
              </TabPanel>
              <TabPanel>
                <p>Breached Tasks</p>
                <Table variant="simple">
                  <TableCaption>Tasks breached!</TableCaption>
                  <Thead>
                    <Tr>
                      <Th>Title</Th>
                      <Th>Comment</Th>
                      <Th>Date of completion</Th>
                      <Th>Mark as completed</Th>
                      <Th>Edit the Task</Th>
                      <Th>Delete the task</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {tasks ? (
                      tasks.map((e) => {
                        if (
                          e.completed === false &&
                          new Date(e.lastDate).getTime() < new Date().getTime()
                        )
                          return (
                            <Tr key={e._id}>
                              <Td>{e.taskTitle}s</Td>
                              <Td>{e.taskComment}</Td>
                              <Td>{e.lastDate.split("T").join(" ")}</Td>
                              <Td>
                                <Button
                                  colorScheme={"linkedin"}
                                  onClick={() => handleComplete(e)}
                                >
                                  Completed
                                </Button>
                              </Td>
                              <Td>
                                <Button
                                  onClick={() => {
                                    setSelectedTask(e);
                                    onOpen();
                                  }}
                                  colorScheme="telegram"
                                >
                                  Edit
                                </Button>

                                <Modal isOpen={isOpen} onClose={onClose}>
                                  <ModalOverlay />
                                  <ModalContent>
                                    <ModalHeader></ModalHeader>
                                    <ModalCloseButton />
                                    <ModalBody>
                                      <FormControl>
                                        <FormLabel>
                                          Date & time of completion
                                        </FormLabel>
                                        <input
                                          type={"datetime-local"}
                                          value={
                                            selectedTask
                                              ? selectedTask.lastDate
                                              : date
                                          }
                                          onChange={(e) =>
                                            setSelectedTask({
                                              ...selectedTask,
                                              lastDate: e.target.value,
                                            })
                                          }
                                        />
                                      </FormControl>
                                      <br></br>
                                      <FormControl id="email" isRequired>
                                        <FormLabel>Task title</FormLabel>
                                        <Input
                                          value={
                                            selectedTask
                                              ? selectedTask.taskTitle
                                              : ""
                                          }
                                          type="text"
                                          placeholder="Enter your new task"
                                          onChange={(e) =>
                                            setSelectedTask({
                                              ...selectedTask,
                                              taskTitle: e.target.value,
                                            })
                                          }
                                        />
                                      </FormControl>
                                      <br></br>
                                      <FormControl id="text" isRequired>
                                        <FormLabel>Task comment</FormLabel>
                                        <Input
                                          value={
                                            selectedTask
                                              ? selectedTask.taskComment
                                              : ""
                                          }
                                          type="text"
                                          placeholder="Enter your comment new task"
                                          onChange={(e) =>
                                            setSelectedTask({
                                              ...selectedTask,
                                              taskComment: e.target.value,
                                            })
                                          }
                                        />
                                      </FormControl>
                                    </ModalBody>

                                    <ModalFooter>
                                      <Button
                                        colorScheme="blue"
                                        mr={3}
                                        onClick={onClose}
                                      >
                                        Close
                                      </Button>
                                      <Button
                                        variant="ghost"
                                        colorScheme="blue"
                                        onClick={() => {
                                          handleEdit();
                                          onClose();
                                        }}
                                      >
                                        Done
                                      </Button>
                                    </ModalFooter>
                                  </ModalContent>
                                </Modal>
                              </Td>
                              <Td>
                                <Button
                                  colorScheme={"red"}
                                  onClick={() => handleDelete(e)}
                                >
                                  Delete
                                </Button>
                              </Td>
                            </Tr>
                          );
                      })
                    ) : (
                      <Text>No Breached tasks</Text>
                    )}
                  </Tbody>
                </Table>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </div>
      </Box>
    </>
  );
};

export default About;
