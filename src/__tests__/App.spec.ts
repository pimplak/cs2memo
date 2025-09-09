import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia } from 'pinia'
import { createRouter, createMemoryHistory } from 'vue-router'
import App from '../App.vue'
import Menu from '@/views/Menu.vue'

describe('App', () => {
  it('renders Menu route by default', async () => {
    const router = createRouter({
      history: createMemoryHistory(),
      routes: [
        { path: '/', name: 'menu', component: Menu },
      ],
    })

    const wrapper = mount(App, {
      global: {
        plugins: [createPinia(), router],
      },
    })

    await router.push('/')
    await router.isReady()

    expect(wrapper.html()).toContain('CS2 Memo')
  })
})
