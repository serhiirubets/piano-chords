import React, {useState} from "react";
import {
    Dialog,
    DialogContent,
    DialogTitle,
    Grid,
    Paper,
    Popover,
    Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow,
    Typography
} from "@material-ui/core";
import InfoRoundedIcon from '@material-ui/icons/InfoRounded';
export interface HelpDialogProps {
    iconColor?:string;
}

export const HelpDialog = ({iconColor}:HelpDialogProps) => {
    const [isOpen, setIsOpen] = useState<boolean>(false);

    const handleClickOpen = () => {
        setIsOpen(true);
    };

    const handleClose = (value) => {
        setIsOpen(false);
    };

    const inputData = [
        ['c', 'Нота До октавы по умолчанию'],
        ['c3', 'Нота До малой октавы'],
        ['c e g', 'Аккорд (до мажор)'],
        ['f/g', 'Шестнадцатые f и g'],
        ['/g', 'Шестнадцатая g на слабую долю'],
        ['c:e:g', 'Триоль из с, e, g (cм. ниже)'],
        ['*', 'Нота по умолчанию (меняется в настройках)'],
        ['Правый клик мышью', 'Нота по умолчанию (меняется в настройках)']
    ]

    const octaves = [
        [0, 'Cубконтроктава'],
        [1, 'Контроктава'],
        [2, 'Большая октава'],
        [3, 'Малая октава'],
        [4, 'Первая октава'],
        [5, 'Вторая октава'],
        [6, 'Третья октава'],
        [7, 'Четвертая октава'],
    ]
    return (
        <div>
            <InfoRoundedIcon color="action" onClick={handleClickOpen} style={{fill:iconColor}}/>
            <Dialog onClose={handleClose} aria-labelledby="simple-dialog-title" open={isOpen}>
                <DialogTitle id="simple-dialog-title">Помощь</DialogTitle>
                <DialogContent>
                    Краткое демо возможностей редактора доступно по ссылке: https://youtu.be/CeyyCKWdTLM
                    <hr/>
                    <Typography variant={'h6'}>Ввод в ячейку</Typography>
                    <TableContainer component={Paper}>
                        <Table size="small" aria-label="a dense table">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Ввод в ячейку</TableCell>
                                    <TableCell align="right">Что отобразится</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {inputData.map(row => (
                                    <TableRow key={row.join(' ')}>
                                        <TableCell component="th" scope="row">{row[0]}</TableCell>
                                        <TableCell align="right">{row[1]}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <hr/>
                    <Typography variant={'h6'}>Октавы</Typography>
                    <Typography paragraph>Для записи октав используется западная нотация</Typography>
                    <TableContainer component={Paper}>
                        <Table size="small" aria-label="a dense table">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Запись</TableCell>
                                    <TableCell align="right">Значение</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {octaves.map(row => (
                                    <TableRow key={row.join(' ')}>
                                        <TableCell component="th" scope="row">{row[0]}</TableCell>
                                        <TableCell align="right">{row[1]}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <hr/>
                    <Typography variant={'h6'}>Триоли</Typography>
                    <Typography paragraph>Для записи триолей необходимо:</Typography>
                    <ul>
                        <li>Выделить область триоли: зажать Shift и нажать на 2 крайних квадрата триоли</li>
                        <li>Во всплывающем окошке выбрать
                            ]
                            триоль</li>
                        <li>Записать состав триоли</li>
                    </ul>
                    <Typography paragraph>Элементами триоли могут быть как ноты, так и аккорды</Typography>
                    <Typography paragraph>Для удаления триоли, полностью очистить ввод в режиме
                        редактирования</Typography>
                    <Typography paragraph>Ограничений на кол-во квадратов триоли нет</Typography>

                    <hr/>
                    <Typography variant={'h6'}>Редактирование нот</Typography>
                    <Typography paragraph={true}>
                        Для ручной коррекции введеной ноты (нота, октава) кликнуть на ноту над квадратом и исправить
                        данные во всплывающем окне
                    </Typography>
                </DialogContent>


            </Dialog>
        </div>
    )
}

