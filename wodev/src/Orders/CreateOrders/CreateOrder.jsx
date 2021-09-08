import { Box, Button, ButtonBase, Container, Grid, Modal } from "@material-ui/core";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { GrClose } from "react-icons/gr";
import { saveOrder, updateOrder } from "../../Services/OrderService";
import { ErrorMessage } from "../../Utils/ErrorMessage";
import { useOrders } from "../../_context/orderContext";
import "./CreateOrder.scss";

export const CreateOrder = ({ onCloseCallback, editMode = false, item = {} }) => {
    const { register, handleSubmit, errors } = useForm({ defaultValues: { ...item, Files: "" } });
    const { setFetchData } = useOrders();

    const [fileList, setFileList] = useState(item?.Files ?? []);

    const readFile = (file) =>
        new Promise((resolve, reject) => {
            let reader = new FileReader();
            reader.onload = function () {
                resolve({ data: reader.result, name: file.name });
            };

            reader.onerror = function () {
                reject(reader);
            };

            reader.readAsDataURL(file);
        });

    const selectFiles = (event) => {
        let readers = [];

        for (let file of event.target.files) {
            readers.push(readFile(file));
        }

        Promise.all(readers).then((values) => {
            setFileList(values);
        });
    };

    const submit = async (data) => {
        let user = JSON.parse(localStorage.getItem("user"));
        if (editMode) {
            await updateOrder({...data, Files: fileList },item.Id).then((res) => {
                alert("Zlecenie zaktualizowane");
                setFetchData(true);
                onCloseCallback();
            }).catch((err) => {
                alert(err);
            });;
        } else {
            await saveOrder({
                ...item,
                ...data,
                Files: fileList,
                CreateUserId: user.userId,
            })
                .then((res) => {
                    alert("Zlecenie utworzone");
                    onCloseCallback();
                })
                .catch((err) => {
                    alert(err);
                });
        }
    };

    return (
        <>
            <Modal style={{ margin: "3%", overflowY: "auto" }} open onClose={onCloseCallback}>
                <Container maxWidth="sm" style={{ backgroundColor: "white", padding: "15px" }}>
                    <Grid container direction="column" justifyContent="center" alignItems="stretch">
                        <div style={{ display: "flex" }}>
                            {editMode ? <b>Edytuj zlecenie</b> : <b>Utwórz zlecenie</b>}
                            <GrClose onClick={onCloseCallback} style={{ margin: "5px", marginLeft: "auto" }} />
                        </div>
                        <hr style={{ width: "100%", height: "1px" }} />
                        <label for="name">Nazwa</label>
                        <input className="form-control form-control-lg input" type="text" placeholder="Np. Wodev" name="Name" ref={register({ required: true })} />
                        {errors.name?.type === "required" && <ErrorMessage>Nazwa jest wymagana</ErrorMessage>}
                        <label for="typ">Typ</label>
                        <input className="form-control form-control-lg input" type="text" placeholder="Np. aplikacja mobilna" name="Type" ref={register({ required: true })} />
                        {errors.type?.type === "required" && <ErrorMessage>Typ jest wymagany</ErrorMessage>}

                        <label for="deadline">Planowana data zakończenia</label>
                        <input className="form-control from-control-lg input" type="date" name="DeadLine" ref={register({ required: true })} />
                        {errors.deadline?.type === "required" && <ErrorMessage>Data jest wymagana</ErrorMessage>}

                        <label for="func">Wymagania funkcjonalne</label>
                        <textarea
                            className="form-control form-control-lg input"
                            style={{ maxHeight: "500px", minHeight: "50px", width: "100%" }}
                            type="text"
                            placeholder="Np. Aplikacja musi posiadać panel admina"
                            name="ReqFunc"
                            ref={register({ required: true })}
                        />
                        {errors.func?.type === "required" && <ErrorMessage>Zdefiniuj conajmniej jedno wymaganie</ErrorMessage>}
                        <label for="noFunc">Wymagania niefunkcjonalne</label>
                        <textarea
                            className="form-control form-control-lg input"
                            style={{ maxHeight: "500px", minHeight: "50px", width: "100%" }}
                            type="text"
                            placeholder="Np. Aplikacja musi działać na telefonach z systemem Android"
                            name="ReqNoFunc"
                            ref={register({ required: true })}
                        />

                        <label for="technology">Proponowane technologie</label>
                        <input className="form-control form-control-lg input" type="text" placeholder="Np. Android" name="Technology" ref={register({ required: true })} />
                        {errors.nofunc?.type === "required" && <ErrorMessage>Zdefiniuj conajmniej jedno wymaganie</ErrorMessage>}

                        <span>Dodaj projekt graficzny</span>

                        <div className="row">
                            <div className="col-4">
                                <label for="upload" className="buttonStyle">
                                    Dodaj załączniki
                                </label>
                                <input
                                    id="upload"
                                    type="file"
                                    name="Files"
                                    accept="image/*,.zip,.rar"
                                    multiple
                                    onChange={selectFiles}
                                    style={{ visibility: "hidden" }}
                                    ref={register({ required: true })}
                                />
                            </div>
                            <div className="col-8">
                                <ul style={{ maxHeight: "100px", overflowX: "hidden", overflowY: "auto", width: "100%" }} className="list-group">
                                    {fileList.map((x) => (
                                        <li className="list-group-item" style={{ listStyle: "none", justifyContent: "left" }}>
                                            <GrClose
                                                onClick={() => {
                                                    setFileList(fileList.filter((y) => y != x));
                                                }}
                                                style={{ marginRight: "1px" }}
                                            />
                                            <span style={{ textOverflow: "ellipsis", whiteSpace: "nowrap", overflow: "hidden", width: "250px" }}>{x.name}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        <hr style={{ width: "100%", height: "1px" }} />
                        <div style={{ display: "flex", justifyContent: "end" }}>
                            <Button variant="contained" color="primary" type="submit" onClick={handleSubmit(submit)}>
                                Zapisz
                            </Button>
                        </div>
                    </Grid>
                </Container>
            </Modal>
        </>
    );
};
