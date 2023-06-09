let eventBus = new Vue()

Vue.component('component', {
    template: `
 
        <div class="columns">
            <newCard></newCard>
            
            <p class="head_tabl">Ваши заметки</p>
            
                <column_1 :column_1="column_1"></column_1>
                <column_2 :column_2="column_2"></column_2>
                <column_3 :column_3="column_3"></column_3>
        </div>
    `,

    data() {
        return {
            column_1: [],
            column_2: [],
            column_3: [],
        }

    },
    mounted() {
        this.column_1 = JSON.parse(localStorage.getItem('column_1')) || [];
        this.column_2 = JSON.parse(localStorage.getItem('column_2')) || [];
        this.column_3 = JSON.parse(localStorage.getItem('column_3')) || [];
        eventBus.$on('addColumn_1', ColumnCard => {
            if (this.column_1.length < 3) {
                this.column_1.push(ColumnCard)
                this.saveColumn_1();
            }

        })
        eventBus.$on('addColumn_2', ColumnCard => {
            if (this.column_2.length < 5) {
                this.column_2.push(ColumnCard)
                this.column_1.splice(this.column_1.indexOf(ColumnCard), 0)
                this.saveColumn_2();
            }else{
                alert('Завершите процесс во второй колонке');
            }
        })
        eventBus.$on('addColumn_3', ColumnCard => {
            this.column_3.push(ColumnCard)
            this.column_2.splice(this.column_2.indexOf(ColumnCard), 1)
            this.saveColumn_3();
        })
    },
    methods:{
        saveColumn_1(){
            localStorage.setItem('column_1', JSON.stringify(this.column_1));
        },
        saveColumn_2(){
            localStorage.setItem('column_2', JSON.stringify(this.column_2));
        },
        saveColumn_3(){
            localStorage.setItem('column_3', JSON.stringify(this.column_3));
        }
    },
    watch: {
        column_1(newValue) {
            localStorage.setItem("column_1", JSON.stringify(newValue));
        },
        column_2(newValue) {
            localStorage.setItem("column_2", JSON.stringify(newValue));
        },
        column_3(newValue) {
            localStorage.setItem("column_3", JSON.stringify(newValue));
        }
    },
})

Vue.component('newCard', {
    template: `
    <section id="main" class="main-alt">
    
        <form class="row" @submit.prevent="Submit">
        
        <div class="text">
            <h1 class="main_text">Ваш личный помощник в делах</h1>
            <h2> Запишите сюда свои дела!</h2>
        </div>    
            
        <div class="form_control">
                
            <div class="form_name">
                <input maxlength="20" required type="text" v-model="name" id="name" placeholder="Введите название заметки"/>
            </div>
            
            <input maxlength="30" required type="text"  v-model="point_1" placeholder="Первый пункт"/>
            <br>
            <input maxlength="30" required type="text"  v-model="point_2" placeholder="Второй пункт"/>
            <br>
            <input maxlength="30" required type="text"  v-model="point_3" placeholder="Третий пункт"/> 
            <br>
            <input maxlength="30" type="text"  v-model="point_4"  placeholder="Четвертый пункт"/>
            <br>
             <input maxlength="30" type="text" v-model="point_5"  placeholder="Пятый пункт"/>
        </div>
            <div class="form_control">
                <button class="btn">Отправить</button>
            </div>
        </form>
    </section>
    `,
    data() {
        return {
            name: null,
            point_1: null,
            point_2: null,
            point_3: null,
            point_4: null,
            point_5: null,
            date: null,
        }
    },
    methods: {

        Submit() {
            let card = {
                name: this.name,
                points: [
                    {name: this.point_1, completed: false},
                    {name: this.point_2, completed: false},
                    {name: this.point_3, completed: false},
                    {name: this.point_4, completed: false},
                    {name: this.point_5, completed: false}
                ],
                date: null,
                status: 0,
            }
            eventBus.$emit('addColumn_1', card)
            this.name = null;
            this.point_1 = null
            this.point_2 = null
            this.point_3 = null
            this.point_4 = null
            this.point_5 = null
        }
    }

})

Vue.component('column_1', {
    template: `
        <section id="main" class="main-alt">
            <div class="column column_one">
            <p class="name_column">Начало</p>
            <p>---------------------------------------------------------------</p>
                <div class="card" v-for="card in column_1">
                <h3>{{ card.name }}</h3>
                    <ul class="tasks" v-for="task in card.points"
                        v-if="task.name != null"
                        @click="TaskCompleted(card, task)"
                        :class="{completed: task.completed}">
                        <li>
                        {{ task.name }}
                        </li>
                    </ul>
                    
                </div>
            </div>
        </section>
    `,
    props: {
        column_1: {
            type: Array,
        },
        column_2: {
            type: Array,
        },
        card: {
            type: Object,
        },
    },
    methods: {
        TaskCompleted(ColumnCard, task) {
            if (task.completed === false){
                task.completed = true
                ColumnCard.status += 1
            }
            let count = 0
            for(let i = 0; i < 5; i++){
                if(ColumnCard.points[i].name !== null){
                    count++
                }
            }
            if ((ColumnCard.status / count) * 100 >= 50) {
                eventBus.$emit('addColumn_2', ColumnCard)
                this.column_1.splice(this.column_1.indexOf(ColumnCard), 1)}
        }
    },
})

Vue.component('column_2', {
    template: `
        <section id="main" class="main-alt">
            <div class="column column_two">
            <p class="name_column">В процессе</p>
            <p>---------------------------------------------------------------</p>
                <div class="card" v-for="card in column_2">
                <h3>{{ card.name }}</h3>
                    <ul class="tasks" v-for="task in card.points"
                        v-if="task.name != null"
                        @click="TaskCompleted(card, task)"
                        :class="{completed: task.completed}">
                        <li >
                        {{ task.name }}
                        </li>
                    </ul>
                </div>
            </div>
        </section>
    `,
    props: {
        column_2: {
            type: Array,
        },
        card: {
            type: Object,
        },
    },
    methods: {
        TaskCompleted(ColumnCard, task) {
            if(task.completed === false){
                task.completed = true
                ColumnCard.status += 1
            }
            let count = 0
            for(let i = 0; i < 5; i++) {
                if (ColumnCard.points[i].name !== null) {
                    count++
                }
            }
            if (( ColumnCard.status / count) * 100 >= 100 ) {
                eventBus.$emit('addColumn_3', ColumnCard)
                ColumnCard.date = new Date().toLocaleString()
            }

        }
    }
})

Vue.component('column_3', {
    template: `
        <section id="main" class="main-alt">
            <div class="column column_three">
            <p class="name_column">Завершено</p>
            <p>---------------------------------------------------------------</p>
                <div class="card" v-for="card in column_3">
                <h3>{{ card.name }}</h3>
                    <ul class="tasks" v-for="task in card.points"
                        v-if="task.name != null"
                        @click="TaskCompleted(card, task)"
                        :class="{completed: task.completed}">
                        <li>
                        {{ task.name }}
                        </li>
                    </ul><br>
                  
                        <p>{{ card.date }}</p>
                </div>
            </div>
        </section>
    `,
    props: {
        column_3: {
            type: Array,
        },
        card: {
            type: Object,
        },
    }
})



let app = new Vue({
    el: '#app',
})