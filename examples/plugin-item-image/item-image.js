/**
 * ItemImage plugin example
 */

const pluginPath = 'config.plugin.ItemImage';
const slotPath = 'config.slots.chart-timeline-items-row-item.content';

function getDefaultOptions() {
  return {
    size: 20,
    imageField: 'image',
  };
}

/**
 * ItemImage class - plugin meat
 */
class ItemImage {
  constructor(options, vidoInstance) {
    this.vidoInstance = vidoInstance;
    // merge options with default
    this.options = { ...getDefaultOptions(), ...options };
    this.state = vidoInstance.state;
    this.onDestroy = [];
    // permanently bind item slot to this class (because we want to get options from it)
    this.itemSlot = this.itemSlot.bind(this);
    // save options
    this.state.update(pluginPath, this.options);
    // subscribe options so we can programmatically change something
    this.onDestroy.push(
      this.state.subscribe(pluginPath, (options) => {
        this.options = options;
        vidoInstance.update();
      })
    );
    // add new slot with image to item
    this.state.update(slotPath, (itemContentSlots) => {
      if (!itemContentSlots.includes(this.itemSlot)) itemContentSlots.push(this.itemSlot);
      return itemContentSlots;
    });
  }

  destroy() {
    // clear slots
    this.state.update(slotPath, (itemContentSlots) => {
      return itemContentSlots.filter((slot) => slot !== this.itemSlot);
    });
    // stop listening to changes
    this.onDestroy.forEach((unsubscribe) => unsubscribe());
    this.vidoInstance.api.pluginDestroyed('ItemImage');
  }

  /**
   * This is a slot that will add image to item content
   */
  itemSlot(vido, props) {
    const { html, onChange, update } = vido;

    let imageSource = '';
    onChange((modifiedProps) => {
      props = modifiedProps;
      if (!props || !props.item) return;
      if (props.item && props.item[this.options.imageField]) {
        imageSource = props.item[this.options.imageField];
      }
      update();
    });

    return (content) =>
      imageSource
        ? html`<img
              class="item-image"
              src="${imageSource}"
              width=${this.options.size}
              height=${this.options.size}
            />${content}`
        : content;
  }
}

/**
 * Plugin initialization
 */
export function Plugin(options = {}) {
  return function initialize(vidoInstance) {
    const currentOptions = vidoInstance.state.get(pluginPath);
    if (currentOptions) {
      options = vidoInstance.api.mergeDeep({}, options, currentOptions);
    }
    const itemImage = new ItemImage(options, vidoInstance);
    vidoInstance.api.pluginInitialized('ItemImage');
    return itemImage.destroy;
  };
}
