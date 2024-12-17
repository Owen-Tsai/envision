type Props = {
  open: boolean
  [key: string]: any
}

const useModalOpen = (props: Props, emit: (evt: 'update:open', ...args: any[]) => void) => {
  return computed({
    get: () => props.open,
    set: (val) => emit('update:open', val),
  })
}

export default useModalOpen
