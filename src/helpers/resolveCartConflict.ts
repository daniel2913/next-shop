function ResolveCartConflict(props: Props) {
	const { cart1, cart2 } = props;
	const localCart = useCartStore.getState().items;
	const haveLocal = Object.keys(localCart).length > 0;
	const haveRemote = Object.keys(cart).length > 0;

	if (!haveLocal) {
		useCartStore.setState({ saved, votes, items: cart });
		return;
	}
	if (!haveRemote) {
		useCartStore.getState().setItemsAndUpdate(localCart);
		useCartStore.setState({ saved, votes });
		return;
	}
	if (JSON.stringify(localCart) === JSON.stringify(cart)) {
		useCartStore.setState({ saved, votes });
		return;
	}
	confirm("Do you want to keep items from your local cart?").then((res) => {
		if (res) {
			const merged = mergeCarts(cart, localCart);
			useCartStore.getState().setItemsAndUpdate(merged);
			useCartStore.setState({ saved, votes, items: merged });
		} else {
			useCartStore.persist.clearStorage();
			useCartStore.setState({ saved, votes, items: cart });
		}
	});
}
