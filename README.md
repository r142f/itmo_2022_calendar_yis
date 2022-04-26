# itmo_2022_calendar_yis

### 2 этап
Проект был создан с помощью темплейта `SAPUI5 Application`. Далее был добавлен календарь [sap.ui.unified.Calendar](https://sapui5.hana.ondemand.com/#/entity/sap.ui.unified.Calendar) и были изменены некоторые его параметры.

### 3 этап
В корень проекта был добавлен файл [`calendar.xml`](http://xmlcalendar.ru/data/ru/2022/calendar.xml). Далее этот файл читается с помощью `XMLModel` и на основе полученных данных в календарь добавляется информация о Росийский государственных праздниках в 2022 году.
