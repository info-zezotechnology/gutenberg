/**
 * WordPress dependencies
 */
import { Children, cloneElement } from 'element';

/**
 * Internal dependencies
 */
import { registerBlockType, createBlock, query, setDefaultBlock } from '../../api';
import AlignmentToolbar from '../../alignment-toolbar';
import BlockControls from '../../block-controls';
import Editable from '../../editable';
import InspectorControls from '../../inspector-controls';
import Toggle from 'components/form-toggle';

const { children } = query;

registerBlockType( 'core/text', {
	title: wp.i18n.__( 'Text' ),

	icon: 'text',

	category: 'common',

	attributes: {
		content: children(),
	},

	merge( attributes, attributesToMerge ) {
		return {
			content: wp.element.concatChildren( attributes.content, attributesToMerge.content ),
		};
	},

	edit( { attributes, setAttributes, insertBlockAfter, focus, setFocus, mergeBlocks } ) {
		const { align, content, dropCap } = attributes;
		const toggleDropCap = () => setAttributes( { dropCap: ! dropCap } );
		return [
			focus && (
				<BlockControls key="controls">
					<AlignmentToolbar
						value={ align }
						onChange={ ( nextAlign ) => {
							setAttributes( { align: nextAlign } );
						} }
					/>
				</BlockControls>
			),
			focus && (
				<InspectorControls>
					<Toggle checked={ !! dropCap } onChange={ toggleDropCap } />
				</InspectorControls>
			),
			<Editable
				key="editable"
				value={ content }
				onChange={ ( nextContent ) => {
					setAttributes( {
						content: nextContent,
					} );
				} }
				focus={ focus }
				onFocus={ setFocus }
				onSplit={ ( before, after ) => {
					setAttributes( { content: before } );
					insertBlockAfter( createBlock( 'core/text', {
						content: after,
					} ) );
				} }
				onMerge={ mergeBlocks }
				style={ { textAlign: align } }
				className={ `drop-cap-${ dropCap }` }
			/>,
		];
	},

	save( { attributes } ) {
		const { align, content } = attributes;

		if ( ! align ) {
			return content;
		}

		return Children.map( content, ( paragraph ) => (
			cloneElement( paragraph, { style: { textAlign: align } } )
		) );
	},
} );

setDefaultBlock( 'core/text' );
