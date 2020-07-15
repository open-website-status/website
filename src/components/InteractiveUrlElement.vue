<template>
  <v-tooltip bottom>
    <template v-slot:activator="{ on }">
      <span
        class="interactive-url-element"
        :class="{
          'interactive-url-element--different': different
        }"
        v-on="on"
      >
        <slot />
      </span>
    </template>
    <span v-text="label" />
  </v-tooltip>
</template>

<script lang="ts">
  import { Vue, Component, Prop } from 'vue-property-decorator';

  @Component
  export default class InteractiveUrlElement extends Vue {
    @Prop({ default: false, type: Boolean }) readonly different!: boolean

    @Prop({ required: true, type: String }) readonly label!: string
  }
</script>

<style lang="scss">
  .interactive-url-element {
    padding: 1px 2px;
    margin: 1px 1px;
    background-color: #fff2;
    border: 1px dotted #fff8;
    border-radius: 3px;
    display: block;
    white-space: nowrap;

    &--different {
      border: 1px dotted #d11;
      background-color: #d112;
    }
  }
</style>
