<script>
  import WagPay from './WagPay'
  const wag = new WagPay(window, '0x444A900d6CC95F8d4568cB6e3096f518B9606294', '4PiUQB8z7iMRyJLRo3A9Tth9UDGzXuDaQ9kNhVewuSiQ')

  const payEther = () => {
    wag.sendEthTransaction('0.01')
  }

  const paySol = () => {
    wag.sendSolTransaction(1)
  }
</script>

<main>
  <button on:click={() => payEther()}>Ether</button>
  <button on:click={() => paySol()}>Solana</button>
</main>

<style>
  :root {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
      Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  }

  main {
    text-align: center;
    padding: 1em;
    margin: 0 auto;
  }

  img {
    height: 16rem;
    width: 16rem;
  }

  h1 {
    color: #ff3e00;
    text-transform: uppercase;
    font-size: 4rem;
    font-weight: 100;
    line-height: 1.1;
    margin: 2rem auto;
    max-width: 14rem;
  }

  p {
    max-width: 14rem;
    margin: 1rem auto;
    line-height: 1.35;
  }

  @media (min-width: 480px) {
    h1 {
      max-width: none;
    }

    p {
      max-width: none;
    }
  }
</style>
