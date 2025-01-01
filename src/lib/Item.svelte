<script lang="ts">
  import type { Snippet } from "svelte";

  export interface ItemData {
    name: string;
    link?: string;
    image?: string;
  }

  interface Props extends ItemData {
    children?: Snippet;
  }

  const { name, link, image, children }: Props = $props();
</script>

<article>
  {@render children?.()}
  {#if image}
    <img src={image} alt={name} />
  {/if}
  <div>
    <span>{name}</span>
    {#if link}
      <a href={link}>{link}</a>
    {/if}
  </div>
</article>

<style>
  article {
    display: flex;
    background: var(--secondary-bg);
    padding: 1ch;
    gap: 1ch;
  }

  div {
    display: flex;
    flex-direction: column;
    align-self: center;
  }

  span {
    text-wrap: balance;
  }

  img {
    align-self: center;
    max-height: 3em;
    vertical-align: middle;
  }

  a {
    font-size: small;
  }
</style>
