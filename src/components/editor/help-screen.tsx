import React, {useState} from "react";
import {Dialog, DialogContent, DialogTitle, Grid, Popover, Typography} from "@mui/material";
import InfoRoundedIcon from '@mui/icons-material/InfoRounded';


export const HelpDialog = () => {
    const [isOpen, setIsOpen] = useState<boolean>(false);

    const handleClickOpen = () => {
        setIsOpen(true);
    };

    const handleClose = (value) => {
        setIsOpen(false);
    };


    return (
        <div>
            <InfoRoundedIcon onClick={handleClickOpen}/>
            <Dialog onClose={handleClose} aria-labelledby="simple-dialog-title" open={isOpen}>
                <DialogTitle id="simple-dialog-title">Краткое описание</DialogTitle>
                <DialogContent>
                    <Typography variant={'h6'}>Доступный функционал</Typography>
                    {['Заполнение сетки нотами и аккордами',
                        'Автовыравнивание подписей нот и аккордов',
                        'Редактирование нот и аккордов',
                        'Шестнадцатые ноты',
                        'Триоли',
                        'Воспроизведение отдельного квадрата и всей композиции',
                        'Изменение темпа воспроизведения',
                        'Копирование и перемещение квадратов',
                        'Запись схемы в кеш браузера и вычитка из него (Пока не реализована работа с файлами)',
                        'Сохранение в файл и загрузка из него',
                        'Изменение цвета нот (оперение)',
                        ].map(item => <Typography>* {item}</Typography>)}
                    <Typography variant={'h6'}>В ближайших планах</Typography>
                    {[
                        'Подписи аплликатуры и октавы',
                        'Оптимизация отображения подписей'].map(item => <Typography>* {item}</Typography>)}

                        <Typography variant={'h6'}>Демо</Typography>
                    <Typography paragraph={true}>
                        Краткое демо возможностей редактора доступно по ссылке: https://youtu.be/CeyyCKWdTLM
                    </Typography>

                    <Typography variant={'h6'}>Ввод данных в ячейку</Typography>
                    <Typography paragraph={true}>
                        Для редактирования ячейки блок схемы навести мышь, кликнуть, ввести ноты.
                    </Typography>
                    <Typography paragraph={true}>
                        Аккорды вводятся через пробел. Например "c e g" - будет истолковано как трезвучие До мажор
                    </Typography>
                    <Typography paragraph={true}>
                        Шестнадцатые ноты вводятся через cимвол /. Например "c / e" - будет истолковано как 2
                        шестнадцатые ноты в квадрате, 1я - до, 2я- ми
                    </Typography>
                    <Typography paragraph={true}>
                        Ноты вводятся на латинской раскладке и в западной нотации:
                        с - до
                        d - ре
                        e - ми
                        f - фа
                        g - соль
                        a - ля
                        b - си
                        Знаки альтерации: # - диез, b - бемоль. Т.е. eb - будет истолковано как ми бемоль
                    </Typography>
                    <Typography paragraph={true}>
                        По умолчанию ноты правой руки находятся в первой октаве, левой - в малой. Чтоб изменить октаву после ввода кликнуть на ноту и ввести нужное значение.
                    </Typography>
                    <Typography paragraph={true}>
                        Есть возможность вводить ноты сразу в нужной октаве.
                        Для обозначения октав используется западная нотация:
                        0 - субконтр октава
                        1 - контр
                        2 - большая
                        3 - малая
                        4 - первая
                        5 - вторая
                        6 - третья
                        7 - четвертая
                        Запись интервалов с использованием этого механизма выглядит как: "c3 e4" - децима состоящая из
                        до
                        малой октавы и ми первой октавы
                    </Typography>
                    <Typography variant={'h6'}>Редактирование нот</Typography>
                    <Typography paragraph={true}>
                        Для ручной коррекции введеной ноты (нота, октава) кликнуть на ноту над квадратом и исправить
                        данные во всплывающем окне
                    </Typography>
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

