import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  base: '/my_ai_web/lecture1/new_project/',
  build: {
    rollupOptions: {
      input: {
        index: resolve(__dirname, 'index.html'),
        auth: resolve(__dirname, 'html/auth.html'),
        contents: resolve(__dirname, 'html/contents.html'),
        detail: resolve(__dirname, 'html/detail.html'),
        upload: resolve(__dirname, 'html/upload.html'),
        mypage: resolve(__dirname, 'html/mypage.html'),
      }
    }
  }
})
