import Link from 'next/link';

export default function PrivacyPolicy() {
  return (
    <div className='m-auto h-screen md:m-0 pt-[50px] md:pt-[109px] md:pl-[81px] px-10'>
      <h1 className='text-2xl font-semibold '>Privacy Policy for Electo</h1>
      <hr className='h-[2px] my-4 bg-gray-100 border-0 rounded dark:bg-gray-700 ' />
      <p className='text-sm md:text-base my-3 text-muted-foreground'>
        Effective Date: 10/25/2024
      </p>
      <div className='max-h-[70vh] overflow-auto'>
        <p className='text-sm italic'>Disclaimer:</p>
        <p className='text-sm my-3 italic'>
          Electo is an independent application, unaffiliated with and not
          endorsed by any government entity. Electo aggregates data from
          reputable public sources and third-party databases to inform users on
          U.S. legislative and political matters. While Electo strives for
          accuracy, the app does not represent or substitute for any official
          government resource, nor does it guarantee the completeness or
          timeliness of all information. Electo users are encouraged to consult
          official sources as needed.
        </p>

        <p className='text-sm md:text-base my-3'>1. Introduction</p>
        <p className='text-muted-foreground'>
          This Privacy Policy explains how Electo collects, uses, shares, and
          protects personal and non-personal information collected from users.
          By using the Electo mobile application (“App”), users agree to the
          terms outlined in this policy. The policy applies to all Electo users.
        </p>

        <p className='text-sm md:text-base my-3'>2. Information We Collect</p>
        <p className='text-muted-foreground'>
          Electo collects both personal and non-personal information to provide
          an informative and functional user experience.
        </p>
        <p className='text-muted-foreground'>
          a. Information You Provide Directly:
        </p>
        <ul className='list-inside list-disc text-muted-foreground mx-2'>
          <li>
            Account Registration Data: Upon account creation, users may provide
            personal identifiers, including name, email address, and any
            additional, optional account information.
          </li>
          <li>
            User-Generated Content: Electo may collect and store any content
            provided within the app, such as comments, saved preferences, or
            other information added by users.
          </li>
        </ul>

        <p className='text-muted-foreground'>
          b. Automatically Collected Information:
        </p>
        <ul className='list-inside list-disc text-muted-foreground mx-2'>
          <li>
            Device Information: We collect data from users’ devices, including
            but not limited to IP address, device identifiers, operating system,
            and browser type, which aids in diagnosing issues, ensuring
            security, and improving app performance.
          </li>
          <li>
            Usage Data: Electo collects app usage patterns, session data, and
            clickstream data to optimize features and refine user experience.
          </li>
          <li>
            Cookies and Tracking Technologies: Electo uses cookies and similar
            technologies to enhance functionality and tailor content to user
            preferences.
          </li>
        </ul>

        <p className='text-sm md:text-base my-3'>
          3. Use of Personal Information
        </p>
        <p className='text-muted-foreground'>
          Electo uses personal information to improve the app’s functionality
          and provide reliable services, including but not limited to:
        </p>
        <ul className='list-inside list-disc text-muted-foreground mx-2'>
          <li>
            Service Delivery and Improvement: Personal information is used to
            manage user accounts, deliver app content, and improve Electo’s
            features.
          </li>
          <li>
            User Support and Communication: Electo uses contact information to
            communicate directly with users, respond to inquiries, and notify
            users of updates.
          </li>
          <li>
            Research and Development: User data, including anonymized usage
            data, informs internal research to enhance app functionality.
          </li>
          <li>
            Security Measures: Personal information aids in maintaining the
            security, integrity, and lawful operation of Electo.
          </li>
          <li>
            Legal Compliance and Rights Protection: Electo may process and
            disclose data to comply with legal requirements or protect its
            rights and those of its users.
          </li>
        </ul>

        <p className='text-sm md:text-base my-3'>
          4. Disclosure of Personal Information
        </p>
        <p className='text-muted-foreground'>
          Electo only shares personal information with third parties under
          specific, limited conditions:
        </p>
        <ul className='list-inside list-disc text-muted-foreground mx-2'>
          <li>
            Service Providers and Vendors: Electo partners with trusted
            providers who assist in delivering services, such as hosting, data
            processing, and security operations. These providers are bound by
            strict confidentiality agreements and do not use personal
            information for independent purposes.
          </li>
          <li>
            Business Transfers: Should Electo undergo a merger, acquisition, or
            asset sale, user information may be transferred as part of the
            business. Users will be notified of such changes.
          </li>
          <li>
            Legal Requirements and Protection of Rights: Electo may disclose
            information to comply with legal obligations or protect the rights
            of Electo and its users.
          </li>
        </ul>

        <p className='text-sm md:text-base my-3'>5. Your Rights and Choices</p>
        <p className='text-muted-foreground'>
          Electo respects user rights regarding their personal data. Depending
          on the jurisdiction, users may have rights to access, amend, delete,
          or limit data collection features. Users may contact Electo’s support
          team for inquiries.
        </p>

        <p className='text-sm md:text-base my-3'>
          6. Data Retention and Security
        </p>
        <ul className='list-inside list-disc text-muted-foreground mx-2'>
          <li>
            Security Measures: Electo implements advanced security measures,
            including data encryption, secure server storage, and limited data
            access, to protect user information from unauthorized access or
            disclosure.
          </li>
          <li>
            Data Retention: Electo retains personal information only as long as
            necessary to fulfill app functions, comply with legal obligations,
            and resolve disputes.
          </li>
        </ul>

        <p className='text-sm md:text-base my-3'>
          7. International Data Processing
        </p>
        <p className='text-muted-foreground'>
          Electo’s services are hosted and processed in the United States. By
          using the app, international users consent to data transfer and
          processing in the U.S., in compliance with applicable U.S. data
          protection laws.
        </p>

        <p className='text-sm md:text-base my-3'>
          8. Updates to This Privacy Policy
        </p>
        <p className='text-muted-foreground'>
          Electo may update this policy periodically to reflect changes in the
          app’s operations, legal requirements, or privacy practices. Users will
          be notified of material changes through the app or via email.
        </p>

        <p className='text-sm md:text-base my-3'>
          9. Data Sources, Reliability, and Transparency
        </p>
        <ul className='list-inside list-disc text-muted-foreground mx-2'>
          <li>
            Federal Legislative Data: Sourced from{' '}
            <Link href='https://www.congress.gov' className='underline'>
              Congress.gov
            </Link>{' '}
            , the official platform for U.S. federal legislative data.
          </li>
          <li>
            State Bills and Legislation: Sourced through the{' '}
            <Link href='https://api.legiscan.com' className='underline'>
              {' '}
              LegiScan API,
            </Link>{' '}
            an authoritative resource for tracking U.S. state legislative
            information.
          </li>
          <li>
            Campaign Finance and Political Funding: Sourced from{' '}
            <Link href='https://www.opensecrets.org/' className='underline'>
              {' '}
              OpenSecrets,
            </Link>{' '}
            a respected, nonpartisan repository of U.S. political finance data.
          </li>
          <li>
            State Representative Information and Voting Records: Aggregated from{' '}
            <Link href='https://v3.openstates.org/docs' className='underline'>
              {' '}
              Open states,
            </Link>{' '}
            which collects and standardizes legislative data from all U.S.
            states.
          </li>
        </ul>

        <p className='text-sm md:text-base my-3'>10. Contact Us</p>
        <p className='text-muted-foreground'>
          For inquiries regarding this Privacy Policy, Electo’s data practices,
          or specific questions about our data sources, users can reach Electo’s
          support team at{' '}
          <a
            href='mailto:info@electoai.com'
            className='underline text-black dark:text-muted-foreground'
          >
            info@electoai.com
          </a>
          .
        </p>
      </div>
    </div>
  );
}
