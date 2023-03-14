let eventBus = new Vue()

Vue.component('component', {
    template: `
 
        <div class="columns">
            <newCard></newCard>
            
            <p class="head_tabl">Ваши заметки</p>
            
        <p class="error" v-for="error in errors">{{ error }}</p>
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
            errors: [],
        }

    },
    mounted() {
        eventBus.$on('addColumn_1', ColumnCard => {

            if (this.column_1.length < 3) {
                this.errors.length = 0
                this.column_1.push(ColumnCard)
            } else {
                this.errors.length = 0
                this.errors.push()
            }
        })
    }
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
                <input required type="text" v-model="name" id="name" placeholder="Введите название заметки"/>
            </div>
            
            <input required type="text"  v-model="point_1" placeholder="Первый пункт"/>
            <br>
            <input required type="text"  v-model="point_2" placeholder="Второй пункт"/>
            <br>
            <input required type="text"  v-model="point_3" placeholder="Третий пункт"/> 
            <br>
            <input  type="text"  v-model="point_4"  placeholder="Четвертый пункт"/>
            <br>
             <input type="text" v-model="point_5"  placeholder="Пятый пункт"/>
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
                errors: [],
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
        errors: {
            type: Array,
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
                this.column_1.splice(this.column_1.indexOf(ColumnCard), 0)
            }
        },
    },
})

let app = new Vue({
    el: '#app',
})