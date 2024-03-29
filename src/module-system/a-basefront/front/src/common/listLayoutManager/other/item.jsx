import Actions from './item_actions.jsx';
import ContextMenu from './item_contextMenu.jsx';
import CommonItem from '../../common/item.jsx';

export default {
  mixins: [Actions, ContextMenu, CommonItem],
  methods: {
    item_getMetaSummary(item) {
      const arr = [];
      // atomClass
      if (!this.container.atomClass) {
        arr.push(item.atomClassTitleLocale);
      }
      // resourceType
      const resourceType = item.resourceTypeLocale;
      if (resourceType) {
        arr.push(resourceType);
      }
      // atomCategoryName
      const formCategory = this.$meta.util.getProperty(this.filter.data, 'form.category');
      const atomCategoryName = item.atomCategoryNameLocale || item.atomCategoryName;
      if (!formCategory && atomCategoryName) {
        arr.push(atomCategoryName);
      }
      // summary
      const summary = (item._meta && item._meta.summary) || '';
      if (summary) {
        arr.push(summary);
      }
      // join
      return arr.join(' / ');
    },
    item_getMetaFlags(item) {
      let flags = (item._meta && item._meta.flags) || [];
      if (!Array.isArray(flags)) flags = flags.split(',');
      return flags;
    },
    item_getLabel(id) {
      if (!this.base_userLabels) return null;
      return this.base_userLabels[id];
    },
    item_renderMedia(item, className, mediaFieldName) {
      return <img class={className || 'avatar avatar24'} src={this.item_getMetaMedia(item, mediaFieldName)} />;
    },
    item_renderMedia2(info, className, media) {
      const item = info.item || info.record;
      if (media === false) return null;
      let domMedia;
      if (media === '_index') {
        const text = `#${info.index + 1}`;
        domMedia = <div>{text}</div>;
      } else if (media === '_indexTotal') {
        const text = `#${info.indexTotal + 1}`;
        domMedia = <div>{text}</div>;
      } else {
        const mediaFieldName = media === true ? undefined : media;
        domMedia = this.item_renderMedia(item, className, mediaFieldName);
      }
      return domMedia;
    },
    item_renderStats(item) {
      const children = [];
      if (item.star > 0) {
        children.push(
          <span key="stat_star">
            <f7-icon f7="::star" size="14" color="orange"></f7-icon>
          </span>
        );
      }
      if (item.attachmentCount > 0) {
        let domAttachmentCount;
        if (item.attachmentCount > 1) {
          domAttachmentCount = <sub class="text-color-orange">{item.attachmentCount}</sub>;
        }
        children.push(
          <span key="stat_attachmentCount_icon">
            <f7-icon f7="::attachment-line" size="14" color="orange"></f7-icon>
            {domAttachmentCount}
          </span>
        );
      }
      if (item.commentCount > 0) {
        let domCommentCount;
        if (item.commentCount > 1) {
          domCommentCount = <sub class="text-color-orange">{item.commentCount}</sub>;
        }
        children.push(
          <span key="stat_commentCount_icon">
            <f7-icon f7="::comment-dots" size="14" color="orange"></f7-icon>
            {domCommentCount}
          </span>
        );
      }
      return children;
    },
    item_getAtomStateColor(item) {
      const atomState = String(item.atomState);
      if (['-1'].includes(atomState)) return 'teal';
      if (['-2', '-3'].includes(atomState)) return 'gray';
      return 'orange';
    },
    item_renderAtomClosed(item) {
      if (item.atomClosed) {
        const color = this.item_getAtomStateColor(item);
        return (
          <f7-badge key="_atomClosed" color={color}>
            {this.$text('Closed')}
          </f7-badge>
        );
      }
      return null;
    },
    item_renderFlowNodeState(item) {
      // ignore 0/'0'
      // eslint-disable-next-line
      if (item.atomState != 0 && item._atomStateTitleLocale) {
        const color = this.item_getAtomStateColor(item);
        return (
          <f7-badge key="_atomStateTitleLocale" color={color}>
            {item._atomStateTitleLocale}
          </f7-badge>
        );
      }
      return null;
    },
    item_renderMetaFlags(item) {
      const domMetaFlags = [];
      // // atomClosed
      // const domAtomClosed = this.item_renderAtomClosed(item);
      // if (domAtomClosed) {
      //   domMetaFlags.push(domAtomClosed);
      // }
      // flow
      const domFlowNodeState = this.item_renderFlowNodeState(item);
      if (domFlowNodeState) {
        domMetaFlags.push(domFlowNodeState);
      }
      // flags
      const itemFlags = this.item_getMetaFlags(item);
      for (const flag of itemFlags) {
        domMetaFlags.push(<f7-badge key={flag}>{flag}</f7-badge>);
      }
      return domMetaFlags;
    },
    item_renderLabels(item) {
      const domLabels = [];
      if (item.labels && this.base_userLabels) {
        for (const label of JSON.parse(item.labels)) {
          const _label = this.item_getLabel(label);
          domLabels.push(
            <f7-badge key={label} style={{ backgroundColor: _label.color }}>
              {(_label.text || '')[0]}
            </f7-badge>
          );
        }
      }
      return domLabels;
    },
  },
};
