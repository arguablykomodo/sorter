<div class="throbber"></div>

<style>
  .throbber {
    vertical-align: middle;
    display: inline-block;
    margin-inline-end: 4px;
    position: relative;
    width: 1em;
    height: 1em;
    background: conic-gradient(transparent, var(--accent-bg));
    border-radius: 100%;
    animation: throbber 1s infinite linear;
  }

  .throbber::after {
    content: "";
    display: block;
    position: absolute;
    width: calc(1em - 4px);
    height: calc(1em - 4px);
    left: 2px;
    top: 2px;
    background: var(--secondary-bg);
    border-radius: 100%;
  }

  @keyframes throbber {
    to {
      transform: rotate(1turn);
    }
  }
</style>
