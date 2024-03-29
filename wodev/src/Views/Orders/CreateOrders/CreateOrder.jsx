import { Box, Button, ButtonBase, Container, Grid, Modal } from "@material-ui/core";
import React, { useState } from "react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { GrClose, GrDownload } from "react-icons/gr";
import { getById, saveOrder, updateOrder } from "../../../Services/OrderService";
import { ErrorMessage } from "../../../Utils/ErrorMessage";
import { base64toFile } from "../../../Utils/fileUtils";
import { useOrders } from "../../../_context/orderContext";
import "./CreateOrder.scss";

export const CreateOrder = ({ onCloseCallback, editMode = false, itemId }) => {
    const [item, setItem] = useState({});

    const user = JSON.parse(localStorage.getItem("user"));
    const { register, handleSubmit, errors, reset } = useForm({ defaultValues: { ...item, Files: "" } });

    useEffect(() => {
        if (editMode) {
            async function get() {
                await getById(itemId).then((res) => {
                    if (res.status == 200) {
                        setItem({
                            DeadLine: res.data.deadLine,
                            Id: res.data.id,
                            Name: res.data.name,
                            ReqFunc: res.data.reqFunc,
                            ReqNoFunc: res.data.reqNoFunc,
                            Technology: res.data.technology,
                            Type: res.data.type,
                        });

                        setFileList(res.data.files.map((x) => ({ Name: x.name, Data: x.data })));
                    }
                });
            }
            get();
        }
    }, []);

    useEffect(() => {
        if (editMode) {
            reset(item);
        }
    }, [item]);

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
            await updateOrder({ ...data, Files: fileList }, item.Id)
                .then((res) => {
                    alert("Zlecenie zaktualizowane");
                    setFetchData(true);
                    onCloseCallback();
                })
                .catch((err) => {
                    alert(err);
                });
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

    function base64toFile(data,fileName) {
        var bufferArray = base64ToArrayBuffer(data.replace(/^.+base64,/,''));
        var blobStore = new Blob([bufferArray]);
        if (window.navigator && window.navigator.msSaveOrOpenBlob) {
            window.navigator.msSaveOrOpenBlob(blobStore);
            return;
        }
        var data = window.URL.createObjectURL(blobStore);
        var link = document.createElement('a');
        document.body.appendChild(link);
        link.href = data;
        link.download = fileName;
        link.click();
        window.URL.revokeObjectURL(data);
        link.remove();
    }
    
    function base64ToArrayBuffer(data) {
        var bString = window.atob(data);
        var bLength = bString.length;
        var bytes = new Uint8Array(bLength);
        for (var i = 0; i < bLength; i++) {
            var ascii = bString.charCodeAt(i);
            bytes[i] = ascii;
        }
        return bytes;
    };

    return (
        <div>
            <Modal className="modalOrder" open onClose={onCloseCallback}>
                <Container maxWidth="sm" style={{ backgroundColor: "white", padding: "15px" }}>
                    <form onSubmit={handleSubmit(submit)}>
                        <Grid container direction="column" justifyContent="center" alignItems="stretch">
                            <div style={{ display: "flex" }}>
                                {editMode ? <b>Edytuj zlecenie</b> : <b>Utwórz zlecenie</b>}
                                <GrClose onClick={onCloseCallback} style={{ margin: "5px", marginLeft: "auto" }} />
                            </div>
                            <hr style={{ width: "100%", height: "1px" }} />
                            <label for="Name">Nazwa</label>
                            <input className="form-control form-control-lg input" type="text" placeholder="Np. Wodev" name="Name" ref={register({ required: true })} />
                            {errors.Name?.type === "required" && <ErrorMessage>Nazwa jest wymagana</ErrorMessage>}
                            <label for="Type">Typ</label>
                            <input className="form-control form-control-lg input" type="text" placeholder="Np. aplikacja mobilna" name="Type" ref={register({ required: true })} />
                            {errors.Type?.type === "required" && <ErrorMessage>Typ jest wymagany</ErrorMessage>}

                            <label for="DeadLine">Planowana data zakończenia</label>
                            <input className="form-control from-control-lg input" type="date" name="DeadLine" ref={register({ required: true })} />
                            {errors.DeadLine?.type === "required" && <ErrorMessage>Data jest wymagana</ErrorMessage>}

                            <label for="ReqFunc">Wymagania funkcjonalne</label>
                            <textarea
                                className="form-control form-control-lg input"
                                style={{ maxHeight: "500px", minHeight: "50px", width: "100%" }}
                                type="text"
                                placeholder="Np. Aplikacja musi posiadać panel admina"
                                name="ReqFunc"
                                ref={register({ required: true })}
                            />
                            {errors.ReqFunc?.type === "required" && <ErrorMessage>Zdefiniuj conajmniej jedno wymaganie</ErrorMessage>}
                            <label for="ReqNoFunc">Wymagania niefunkcjonalne</label>
                            <textarea
                                className="form-control form-control-lg input"
                                style={{ maxHeight: "500px", minHeight: "50px", width: "100%" }}
                                type="text"
                                placeholder="Np. Aplikacja musi działać na telefonach z systemem Android"
                                name="ReqNoFunc"
                                ref={register({ required: true })}
                            />
                            {errors.ReqNoFunc?.type === "required" && <ErrorMessage>Zdefiniuj conajmniej jedno wymaganie</ErrorMessage>}

                            <label for="technology">Proponowane technologie</label>
                            <input className="form-control form-control-lg input" type="text" placeholder="Np. Android" name="Technology" ref={register()} />

                            {user.profile.userProfileTypeId == 2 && <span>Dodaj projekt graficzny lub inne załączniki</span>}
                            {user.profile.userProfileTypeId == 1 && <span>Załączniki</span>}

                            <div className="row">
                                {user.profile.userProfileTypeId == 2 && (
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
                                )}
                                <div className={user.profile.userProfileTypeId == 2 ? "col-8" : "col-12"}>
                                    <ul style={{ maxHeight: "100px", overflowX: "hidden", textOverflow: "ellipsis", overflowY: "auto", width: "100%" }} className="list-group">
                                        {fileList.map((x) => (
                                            <li className="list-group-item" style={{ listStyle: "none", justifyContent: "left" }}>
                                                {user.profile.userProfileTypeId == 2 && (
                                                    <GrClose
                                                        onClick={() => {
                                                            setFileList(fileList.filter((y) => y != x));
                                                        }}
                                                        style={{ marginRight: "1px" }}
                                                    />
                                                )}

                                                <GrDownload
                                                    onClick={() => {
                                                        base64toFile(x.Data, x.Name);
                                                    }}
                                                    style={{ marginRight: "1px" }}
                                                />
                                                <span style={{ textOverflow: "ellipsis", whiteSpace: "nowrap", overflow: "hidden", marginLeft: "5px" }}>{x.name ?? x.Name}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                            {errors?.Files?.type === "required" && <ErrorMessage>Dodaj conajmniej jeden plik</ErrorMessage>}

                            <hr style={{ width: "100%", height: "1px" }} />
                            <div style={{ display: "flex", justifyContent: "end" }}>
                                <Button variant="contained" color="primary" type="submit">
                                    Zapisz
                                </Button>
                            </div>
                        </Grid>
                    </form>
                </Container>
            </Modal>
        </div>
    );
};
