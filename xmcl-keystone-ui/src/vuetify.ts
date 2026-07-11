import CurseforgeIcon from '@/components/CurseforgeIcon.vue'
import FTBIcon from '@/components/FTBIcon.vue'
import ImageIcon from '@/components/ImageIcon.vue'
import JarFileIcon from '@/components/JarFileIcon.vue'
import ModrinthIcon from '@/components/ModrinthIcon.vue'
import PackageFileIcon from '@/components/PackageFileIcon.vue'
import ZipFileIcon from '@/components/ZipFileIcon.vue'
import { h } from 'vue'
import { IconProps, IconSet, createVuetify } from 'vuetify'
import { aliases, md } from 'vuetify/iconsets/md'
import { ar, ru, zhHans } from 'vuetify/locale'
import 'vuetify/styles'
import { BuiltinImages } from './constant'
import { DEFAULT_SURFACE_BUTTON_RADIUS } from './composables/surfaceTokens'

const xmcl: IconSet = {
  component: (props: IconProps) => {
    switch (props.icon) {
      case 'ftb': return h(FTBIcon)
      case 'curseforge': return h(CurseforgeIcon)
      case 'zip': return h(ZipFileIcon)
      case 'jar': return h(JarFileIcon)
      case 'package': return h(PackageFileIcon)
      case 'modrinth': return h(ModrinthIcon)
      case 'forge': return h(ImageIcon, { src: BuiltinImages.forge })
      case 'fabric': return h(ImageIcon, { src: BuiltinImages.fabric })
      case 'quilt': return h(ImageIcon, { src: BuiltinImages.quilt })
      case 'minecraft': return h(ImageIcon, { src: BuiltinImages.minecraft })
      case 'prism': return h(ImageIcon, { src: BuiltinImages.prism })
      case 'neoForged': return h(ImageIcon, { src: BuiltinImages.neoForged })
      case 'optifine': return h(ImageIcon, { src: BuiltinImages.optifine })
      case 'iris': return h(ImageIcon, { src: BuiltinImages.iris })
      case 'oculus': return h(ImageIcon, { src: BuiltinImages.oculus })
      case 'mmc': return h(ImageIcon, { src: BuiltinImages.mmc })
      default: return null
    }
  },
}

export const vuetify = createVuetify({
  locale: {
    locale: 'en',
    fallback: 'en',
    messages: { zhHans, ru, ar },
    rtl: {
      ar: true,
    },
  },
  icons: {
    defaultSet: 'md',
    aliases,
    sets: { md, xmcl },
  },
  defaults: {
    VSwitch: {
      inset: true,
      color: 'primary',
    },
    VBtn: {
      rounded: DEFAULT_SURFACE_BUTTON_RADIUS,
    },
    VChip: {
      rounded: DEFAULT_SURFACE_BUTTON_RADIUS,
    },
    VAvatar: {
      color: 'transparent'
    }
  },
  theme: {
    defaultTheme: 'dark',
    themes: {
      light: {},
      system: {},
      dark: {
        dark: true,
        colors: {
          background: '#000000', /* Handled by --md-sys-color-background */
          surface: '#121212',    /* Handled by --md-sys-color-surface */
          primary: '#C5C5C5',    /* Handled by --md-sys-color-primary */
          'primary-darken-1': '#121212', /* Handled by --md-sys-color-on-primary */
          secondary: '#C5C5C5',
          'secondary-darken-1': '#121212',
          error: '#FFB4AB',
          info: '#C5C5C5',
          success: '#C5C5C5',
          warning: '#C5C5C5',
          'on-background': '#E3E3E3',
          'on-surface': '#E3E3E3',
          'on-primary': '#121212',
          'on-secondary': '#121212',
          'on-error': '#93000A',
        },
        variables: {
          /* Nullify Vuetify's default border opacity and shadows to rely purely on M3E */
          'border-color': '#919191',
          'border-opacity': 1,
          'high-emphasis-opacity': 1,
          'medium-emphasis-opacity': 1,
          'disabled-opacity': 0.38,
          'idle-opacity': 0.04,
          'hover-opacity': 0.08,
          'focus-opacity': 0.12,
          'selected-opacity': 0.12,
          'activated-opacity': 0.12,
          'pressed-opacity': 0.12,
          'dragged-opacity': 0.16,
          'theme-kbd': '#E3E3E3',
          'theme-on-kbd': '#121212',
          'theme-code': '#222222',
          'theme-on-code': '#E3E3E3',
        }
      },
    },
  },
})

