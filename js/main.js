window.Event = new Vue();

Vue.component('task-list', {
    template: `
        <div>
            <task v-for="task in tasks" :key="task.task">{{ task.task }}</task>
        </div>
    `,
    data() {
        return {
            tasks: [
                { task: 'Go to the store', completed: true },
                { task: 'Go to the movie', completed: false },
                { task: 'Go to the bank', completed: true },
            ]
        }
    }
});

Vue.component('task', {
    template: '<li><slot></slot></li>'
});

Vue.component('message', {
    props: ['title', 'body'],
    data() {
        return {
            isVisible: true
        };
    },
    template: `
        <article class="message" v-show="isVisible">
            <div class="message-header">
                <p>{{ title }}</p>
                <button @click="hideModal" class="delete" aria-label="delete"></button>
            </div>
            <div class="message-body">
                {{ body }}
            </div>
        </article>
    `,
    methods: {
        hideModal() {
            this.isVisible = false;
        }
    }
});

Vue.component('modal', {
    template: `
        <div class="modal is-active">
            <div class="modal-background"></div>
                <div class="modal-content">
                    <div class="box">
                        <slot></slot>
                    </div>
                </div>
            <button class="modal-close is-large" aria-label="close" @click="$emit('close')"></button>
        </div>
    `
})

Vue.component('tabs', {
    template: `
        <div>
            <div class="tabs">
                <ul>
                    <li v-for="tab in tabs" :class="{ 'is-active': tab.isActive }">
                        <a :href="tab.href" @click="selectTab(tab)">{{ tab.name }}</a>
                    </li>
                </ul>
            </div>

            <div class="tabs-details">
                <slot></slot>
            </div>
        </div>
    `,
    data() {
        return {
            tabs: []
        };
    },
    created() {
        this.tabs = this.$children;
    },
    methods: {
        selectTab(selectedTab) {
            this.tabs.forEach(tab => {
                tab.isActive = (tab.name == selectedTab.name);
            });
        }
    }
});

Vue.component('tab', {
    props: {
        name: { required: true },
        selected: { default: false }
    },
    template: `
        <div v-show="isActive"><slot></slot></div>
    `,
    data() {
        return {
            isActive: false
        };
    },
    computed: {
        href() {
            return '#' + this.name.toLowerCase().replace(/ /g, '-');
        }
    },
    mounted() {
        this.isActive = this.selected
    }
});

Vue.component('coupon', {
    template: `
        <div>
            <input type="text" v-model="name" placeholder="Enter your coupon code" @blur="onCouponApplied">
        </div>
    `,
    data: function () {
        return {
            name: ''
        }
    },
    methods: {
        onCouponApplied() {
            this.$emit('applied');
            Event.$emit('global-applied', {
                name: this.name
            });
        }
    }
});

Vue.component('confirmmodal', {
    template: `
        <div class="modal is-active">
            <div class="modal-background"></div>
            <div class="modal-card">
                <header class="modal-card-head">
                    <p class="modal-card-title">
                        <slot name="header"></slot>
                    </p>

                    <button class="delete" aria-label="close" @click="$emit('close-confirm')"></button>
                </header>

                <section class="modal-card-body">
                    <slot></slot>
                </section>

                <footer class="modal-card-foot">
                    <slot name="footer"></slot>
                    
                </footer>
            </div>
        </div>
    `
});

Vue.component('progress-view', {
    data() {
        return {
            completionRate: 0
        }
    }
});

new Vue({
    el: '#root',
    data: {
        showModal: false,
        showConfirmModal: false,
        modalMessage: 'Blablabla',
        couponApplied: false
    },
    methods: {
        onCouponApplied() {
            this.couponApplied = true;
        }
    },
    created() {
        Event.$on('global-applied', (payload) => alert('Handiling coupon ' + payload.name + '.'))
    }
});