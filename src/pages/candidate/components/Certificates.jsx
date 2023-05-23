const CertificateItem = ({ name, about, image }) => {
	return (
		<div className="relative flex gap-4">
			<div className="shrink-0 h-20 aspect-video bg-gray-100 rounded-lg overflow-hidden">
				<img className="w-full h-full object-cover" src={image} alt="cert" />
			</div>
			<div>
				<p className="text-lg font-medium">{name}</p>
				<p className="text-sm text-primary-washedout/75 mt-2">{about}</p>
			</div>
		</div>
	);
};

const Certificates = ({ certificates }) => {
	return (
		<div className="flex flex-col bg-neutral-0 rounded-2xl">
			<div className="mb-2">
				<p className="font-medium text-letters-secondary">Certificates</p>
			</div>
			{certificates.length > 0 ? (
				certificates.map(({ _id, name, about, file }, i) => (
					<CertificateItem
						name={name}
						about={about}
						image={file}
						key={_id + i}
						onRequestDelete={() => deleteCertificate(_id)}
					/>
				))
			) : (
				<div className="grow flex items-center">
					<h3 className="text-xs text-letters-tertiary">No certificates</h3>
				</div>
			)}
		</div>
	);
};

export default Certificates;
