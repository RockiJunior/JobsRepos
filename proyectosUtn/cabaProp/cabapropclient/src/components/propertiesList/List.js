import ListComponent from './ListComponent';

const List = ({ data, isLoadingProps }) => {
	return (
		<div>
			{isLoadingProps && <div className='loading-layer' />}
			{data && (
				<div className='row mb-5'>
					{data.result.map((prop) => (
						<ListComponent
							prop={prop}
							key={prop._id}
							isLoadingProps={isLoadingProps}
							insideOwl={false}
						/>
					))}
				</div>
			)}
		</div>
	);
};

export default List;
