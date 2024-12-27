const useZoom = () => {
  const zoomPercentage = ref(100)

  const zoomIn = () => {
    if (zoomPercentage.value >= 200) return

    zoomPercentage.value += 10
  }

  const zoomOut = () => {
    if (zoomPercentage.value <= 30) return

    zoomPercentage.value -= 10
  }

  return {
    zoomPercentage,
    zoomIn,
    zoomOut,
  }
}

export default useZoom
